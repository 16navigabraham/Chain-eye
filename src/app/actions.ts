"use server";

import { getAddressRiskSummary, type AddressRiskSummaryInput } from '@/ai/flows/address-risk-summary';

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
