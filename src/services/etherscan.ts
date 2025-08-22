/**
 * @fileoverview Service for interacting with blockchain explorer APIs like Etherscan.
 */
'use server';

interface Transaction {
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

/**
 * Fetches the transaction list for a given address on a specific blockchain.
 * @param address The cryptocurrency address.
 * @param chain The blockchain network.
 * @returns A promise that resolves to the list of transactions.
 */
export async function getTransactionList(address: string, chain: string): Promise<Transaction[]> {
  const chainKey = chain as SupportedChain;
  const config = providerConfig[chainKey];

  if (!config) {
    throw new Error(`Unsupported chain: ${chain}`);
  }
  
  const { apiUrl, apiKey } = config;

  if (!apiKey) {
    throw new Error(`API key for ${chain} is not configured.`);
  }

  const params = new URLSearchParams({
    module: 'account',
    action: 'txlist',
    address: address,
    startblock: '0',
    endblock: '99999999',
    page: '1',
    offset: '100', // Get last 100 transactions
    sort: 'desc',
    apikey: apiKey,
  });

  try {
    const response = await fetch(`${apiUrl}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`API request to ${chain} failed with status ${response.status}`);
    }
    const data = await response.json();
    if (data.status === '0') {
      console.log(`API for ${chain} returned status 0: ${data.message}`);
      if (data.message && data.message.toLowerCase().includes('no transactions found')) {
        return [];
      }
       // Do not throw for other status 0 messages, as it could be a valid empty state.
       // The LLM can interpret the empty result.
       return [];
    }
    return data.result as Transaction[];
  } catch (error) {
    console.error(`Failed to fetch transaction list from ${chain}:`, error);
    throw error;
  }
}
