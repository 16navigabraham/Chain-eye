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
  functionName?: string;
  input: string;
}

export interface Token {
    balance: string;
    contractAddress: string;
    decimals: string;
    name: string;
    symbol: string;
    type: string;
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
        throw new Error(`API key for ${chain} is not configured. Please add it to your .env file.`);
    }

    const searchParams = new URLSearchParams({
        ...params,
        apikey: apiKey,
    });

    try {
        const response = await fetch(`${apiUrl}?${searchParams.toString()}`);
        if (!response.ok) {
            console.error(`API request to ${chain} failed with status ${response.status}:`, await response.text());
            throw new Error(`API request to ${chain} failed with status ${response.status}`);
        }
        const data = await response.json();
        
        if (data.status === '0') {
             // "No transactions found" is a valid empty state, not a critical error.
            if (data.message && (data.message.toLowerCase().includes('no transactions found') || data.message.toLowerCase().includes('no records found'))) {
                return [];
            }
            // For other messages like invalid API key, we should throw an error.
            console.error(`API for ${chain} returned an error: ${data.message} - ${data.result}`);
            // Provide a more specific error message.
            if (data.result && typeof data.result === 'string' && data.result.toLowerCase().includes('invalid api key')) {
                 throw new Error(`Invalid API Key for ${chain}. Please check your .env configuration.`);
            }
            throw new Error(`API Error on ${chain}: ${data.message}`);
        }
        return data.result;
    } catch (error) {
        console.error(`Failed to fetch from ${chain}:`, error);
        // Re-throw the error to be handled by the caller (e.g., the AI tool)
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
  const result = await makeApiRequest(chain, {
    module: 'account',
    action: 'txlist',
    address: address,
    startblock: '0',
    endblock: '99999999',
    page: '1',
    offset: '1000', // Get last 1000 transactions to get a better sense of activity
    sort: 'desc',
  });
  return Array.isArray(result) ? result : [];
}

/**
 * Fetches the list of ERC20 tokens held by an address.
 */
export async function getTokenList(address: string, chain: string): Promise<Token[]> {
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
        console.warn(`Expected an array of token transactions, but got:`, tokenTxs);
        return [];
    }
    
    const uniqueTokens = new Map<string, Token>();
    tokenTxs.forEach((tx: any) => {
        if (tx.contractAddress && !uniqueTokens.has(tx.contractAddress)) {
            uniqueTokens.set(tx.contractAddress, {
                contractAddress: tx.contractAddress,
                name: tx.tokenName,
                symbol: tx.tokenSymbol,
                decimals: tx.tokenDecimal,
                balance: '0', // Note: Balance calculation is not performed in this simple version
                type: 'ERC-20', // Assuming ERC-20 from tokentx
            });
        }
    });

    return Array.from(uniqueTokens.values());
}