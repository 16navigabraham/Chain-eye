/**
 * @fileoverview Service for interacting with the Etherscan API.
 */
'use server';

const ETHERSCAN_API_URL = 'https://api.etherscan.io/api';
const API_KEY = process.env.ETHERSCAN_API_KEY;

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
}

/**
 * Fetches the transaction list for a given address.
 * @param address The cryptocurrency address.
 * @returns A promise that resolves to the list of transactions.
 */
export async function getTransactionList(address: string): Promise<Transaction[]> {
  if (!API_KEY) {
    throw new Error('Etherscan API key is not configured.');
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
    apikey: API_KEY,
  });

  try {
    const response = await fetch(`${ETHERSCAN_API_URL}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`Etherscan API request failed with status ${response.status}`);
    }
    const data = await response.json();
    if (data.status === '0') {
      // This can happen for valid reasons, e.g., no transactions for an address.
      // Or it can be an error. Etherscan returns status 0 and a message.
      console.log(`Etherscan API returned status 0: ${data.message}`);
      if (data.message.toLowerCase().includes('no transactions found')) {
        return [];
      }
      throw new Error(`Etherscan API error: ${data.message} | ${data.result}`);
    }
    return data.result as Transaction[];
  } catch (error) {
    console.error('Failed to fetch transaction list from Etherscan:', error);
    throw error;
  }
}
