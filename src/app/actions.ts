"use server";

import { getAddressRiskSummary, type AddressRiskSummaryInput } from '@/ai/flows/address-risk-summary';

export async function generateRiskSummary(input: AddressRiskSummaryInput): Promise<{ success: boolean; summary?: string; error?: string }> {
  try {
    // In a real app, you would add more robust validation and error handling.
    // For this example, we'll simulate a slight delay to show loading states.
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // For demonstration purposes, we are not calling the real AI flow to avoid API key issues.
    // Instead, we return a mock summary.
    // To use the actual AI flow, uncomment the following lines:
    // const result = await getAddressRiskSummary(input);
    // return { success: true, summary: result.summary };

    const mockSummaries = [
      "This address shows a high volume of transactions with decentralized exchanges, indicating active trading. No direct exposure to sanctioned entities was found, but a small number of transactions are linked to unverified smart contracts. Caution is advised.",
      "Analysis indicates this address is relatively new with a low transaction count. It primarily holds mainstream assets like ETH and USDC. There are no flags for illicit activity, suggesting a low-risk profile at this time.",
      "This address has interacted with several known high-risk gambling dApps and mixers. A significant portion of its outbound transactions are directed to newly created, unverified addresses. This pattern is consistent with attempts to obfuscate fund origins. High risk is associated with this address.",
    ];

    const randomSummary = mockSummaries[Math.floor(Math.random() * mockSummaries.length)];

    return { success: true, summary: randomSummary };

  } catch (e) {
    console.error(e);
    // In a production app, you'd log this error to a monitoring service.
    return { success: false, error: 'Failed to generate AI risk summary. Please try again later.' };
  }
}
