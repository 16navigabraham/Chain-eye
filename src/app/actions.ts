"use server";

import { getAddressRiskSummary, type AddressRiskSummaryInput } from '@/ai/flows/address-risk-summary';
import { getTransactionList, getTokenList, getNftList } from '@/services/etherscan';
import type { Token, Transaction, Nft } from '@/services/etherscan';


export async function generateRiskSummary(input: AddressRiskSummaryInput): Promise<{ success: boolean; summary?: string; error?: string }> {
  try {
    // In a real app, you would add more robust validation and error handling.
    const result = await getAddressRiskSummary(input);
    return { success: true, summary: result.summary };

  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    // In a production app, you'd log this error to a monitoring service.
    return { success: false, error: `Failed to generate AI risk summary: ${errorMessage}. Please try again later.` };
  }
}

export async function getTransactions(address: string, blockchain: string): Promise<{ success: boolean; transactions?: Transaction[]; error?: string }> {
  try {
    const transactions = await getTransactionList(address, blockchain);
    return { success: true, transactions: transactions.slice(0, 100) }; // Return top 100 recent
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to fetch transactions: ${errorMessage}.` };
  }
}

export async function getTokens(address: string, blockchain: string): Promise<{ success: boolean; tokens?: Token[]; error?: string }> {
  try {
    const tokens = await getTokenList(address, blockchain);
    return { success: true, tokens };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to fetch tokens: ${errorMessage}.` };
  }
}

export async function getNfts(address: string, blockchain: string): Promise<{ success: boolean; nfts?: Nft[]; error?: string }> {
  try {
    const nfts = await getNftList(address, blockchain);
    return { success: true, nfts };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { success: false, error: `Failed to fetch NFTs: ${errorMessage}.` };
  }
}