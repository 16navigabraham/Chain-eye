'use server';
/**
 * @fileoverview Service for interacting with the Etherscan V2 API.
 */

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

const V2_API_URL = 'https://api.etherscan.io/v2/api';
const API_KEY = process.env.ETHERSCAN_API_KEY || '';

const chainIdMap: Record<string, string> = {
    ethereum: '1',
    base_mainnet: '8453',
    base_sepolia: '84532',
    bsc: '56',
    polygon: '137',
    arbitrum: '42161',
    // Add other supported chains here
};


async function makeApiRequest(chain: string, params: Record<string, string>): Promise<any> {
    const chainId = chainIdMap[chain];
    if (!chainId) {
        throw new Error(`Unsupported chain: ${chain}`);
    }

    if (!API_KEY) {
        throw new Error(`Etherscan API key is not configured. Please add ETHERSCAN_API_KEY to your .env file.`);
    }

    const searchParams = new URLSearchParams({
        ...params,
        chainid: chainId,
        apikey: API_KEY,
    });

    try {
        const response = await fetch(`${V2_API_URL}?${searchParams.toString()}`);
        if (!response.ok) {
            console.error(`API request to ${chain} (ChainID: ${chainId}) failed with status ${response.status}:`, await response.text());
            throw new Error(`API request to ${chain} failed with status ${response.status}`);
        }
        const data = await response.json();
        
        if (data.status === '0') {
            if (data.message && (data.message.toLowerCase().includes('no transactions found') || data.message.toLowerCase().includes('no records found'))) {
                return [];
            }
            console.error(`API for ${chain} returned an error: ${data.message} - ${data.result}`);
            if (data.result && typeof data.result === 'string' && data.result.toLowerCase().includes('invalid api key')) {
                 throw new Error(`Invalid Etherscan API Key. Please check your .env configuration.`);
            }
            throw new Error(`API Error on ${chain}: ${data.message}`);
        }
        return data.result;
    } catch (error) {
        console.error(`Failed to fetch from ${chain} (ChainID: ${chainId}):`, error);
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
  try {
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
  } catch (e) {
      console.error("Error in getTransactionList:", e);
      return [];
  }
}

/**
 * Fetches the list of ERC20 tokens held by an address.
 */
export async function getTokenList(address: string, chain: string): Promise<Token[]> {
    try {
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
    } catch(e) {
        console.error("Error in getTokenList:", e);
        return [];
    }
}