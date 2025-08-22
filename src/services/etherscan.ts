/**
 * @fileoverview Service for interacting with blockchain explorer APIs like Etherscan.
 */
'use server';

export interface Transaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  functionName?: string; // Optional: can be decoded later
}

export interface Token {
    balance: string;
    contractAddress: string;
    decimals: string;
    name: string;
    symbol: string;
    type: string; // ERC-20, ERC-721, etc.
}


const providerConfig = {
    ethereum: {
        apiUrl: 'https://api.etherscan.io/api',
        apiKey: process.env.ETHERSCAN_API_KEY || ''
    },
    base_mainnet: {
        apiUrl: 'https://api.basescan.org/api',
        apiKey: process.env.BASESCAN_API_KEY || ''
    },
    base_sepolia: {
        apiUrl: 'https://api-sepolia.basescan.org/api',
        apiKey: process.env.BASESCAN_API_KEY || ''
    },
    bsc: {
        apiUrl: 'https://api.bscscan.com/api',
        apiKey: process.env.BSCSCAN_API_KEY || ''
    },
    polygon: {
        apiUrl: 'https://api.polygonscan.com/api',
        apiKey: process.env.POLYGONSCAN_API_KEY || ''
    },
    arbitrum: {
        apiUrl: 'https://api.arbiscan.io/api',
        apiKey: process.env.ARBISCAN_API_KEY || ''
    },
};

type SupportedChain = keyof typeof providerConfig;

async function makeApiRequest(chain: string, params: Record<string, string>): Promise<any> {
    const chainKey = chain as SupportedChain;
    const config = providerConfig[chainKey];

    if (!config) {
        throw new Error(`Unsupported chain: ${chain}`);
    }
    
    const { apiUrl, apiKey } = config;

    if (!apiKey) {
        throw new Error(`API key for ${chain} is not configured.`);
    }

    const searchParams = new URLSearchParams({
        ...params,
        apikey: apiKey,
    });

    try {
        const response = await fetch(`${apiUrl}?${searchParams.toString()}`);
        if (!response.ok) {
        throw new Error(`API request to ${chain} failed with status ${response.status}`);
        }
        const data = await response.json();
        
        // Etherscan API returns status '0' for errors or empty results, with a message.
        if (data.status === '0') {
            // "No transactions found" is a valid empty state, not an error.
            if (data.message && data.message.toLowerCase().includes('no transactions found')) {
                return [];
            }
             // For other messages, we'll treat it as an empty result for the AI to handle.
            console.log(`API for ${chain} returned status 0: ${data.message}`);
            return [];
        }
        return data.result;
    } catch (error) {
        console.error(`Failed to fetch from ${chain}:`, error);
        throw error;
    }
}


/**
 * Fetches the transaction list for a given address on a specific blockchain.
 * @param address The cryptocurrency address.
 * @param chain The blockchain network.
 * @returns A promise that resolves to the list of transactions.
 */
export async function getTransactionList(address: string, chain: string): Promise<Transaction[]> {
  return makeApiRequest(chain, {
    module: 'account',
    action: 'txlist',
    address: address,
    startblock: '0',
    endblock: '99999999',
    page: '1',
    offset: '100', // Get last 100 transactions
    sort: 'desc',
  });
}

/**
 * Fetches the list of ERC20 tokens held by an address.
 * Note: This is a PRO endpoint on Etherscan, may not work on free tier.
 * Using an alternative for wider compatibility may be needed.
 * For now, we assume it might work or return a specific error.
 */
export async function getTokenList(address: string, chain: string): Promise<Token[]> {
    // Etherscan-like APIs do not have a direct 'tokenlist' action.
    // The standard way is to get 'tokentx' and derive holdings, which is complex.
    // Some providers like Covalent or Moralis offer this directly.
    // We will simulate this by fetching token transfers and creating a list of unique tokens.
    // This is a simplified approach. A full implementation would need to calculate balances.
    
    const tokenTxs = await makeApiRequest(chain, {
        module: 'account',
        action: 'tokentx',
        address: address,
        startblock: '0',
        endblock: '99999999',
        page: '1',
        offset: '1000', // Check a good number of transfers to find all tokens
        sort: 'desc',
    });

    if (!Array.isArray(tokenTxs)) {
        return [];
    }
    
    const uniqueTokens = new Map<string, Token>();
    tokenTxs.forEach((tx: any) => {
        if (!uniqueTokens.has(tx.contractAddress)) {
            uniqueTokens.set(tx.contractAddress, {
                contractAddress: tx.contractAddress,
                name: tx.tokenName,
                symbol: tx.tokenSymbol,
                decimals: tx.tokenDecimal,
                balance: '0', // Note: Balance calculation requires more logic
                type: 'ERC-20', // Assuming ERC-20 from tokentx
            });
        }
    });

    return Array.from(uniqueTokens.values());
}
