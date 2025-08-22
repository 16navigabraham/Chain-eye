'use server';

/**
 * @fileOverview A cryptocurrency address risk summary AI agent.
 *
 * - getAddressRiskSummary - A function that handles the address risk summary process.
 * - AddressRiskSummaryInput - The input type for the getAddressRiskSummary function.
 * - AddressRiskSummaryOutput - The return type for the getAddressRiskSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getTransactionList, type Transaction } from '@/services/etherscan';

const AddressRiskSummaryInputSchema = z.object({
  address: z
    .string()
    .describe('The cryptocurrency address to analyze.'),
  blockchain: z.string().optional().describe('The blockchain network of the address. Optional.'),
});
export type AddressRiskSummaryInput = z.infer<typeof AddressRiskSummaryInputSchema>;

const AddressRiskSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the risk factors associated with the address.'),
});
export type AddressRiskSummaryOutput = z.infer<typeof AddressRiskSummaryOutputSchema>;

const getTransactionsTool = ai.defineTool(
  {
    name: 'getTransactionHistory',
    description: 'Get the transaction history for a given cryptocurrency address. Only works for Ethereum mainnet.',
    inputSchema: z.object({
      address: z.string().describe('The cryptocurrency address.'),
    }),
    outputSchema: z.array(z.any()),
  },
  async (input) => {
    console.log(`Using getTransactionHistory tool for address: ${input.address}`);
    try {
      // We are limiting to the first 10 transactions for this example to keep the prompt concise.
      const transactions = (await getTransactionList(input.address)).slice(0, 10);
      return transactions;
    } catch (e) {
      console.error(e);
      // It's better to return an empty array than to throw an error and fail the whole flow.
      // The LLM can then reason about the lack of data.
      return [];
    }
  }
);


export async function getAddressRiskSummary(input: AddressRiskSummaryInput): Promise<AddressRiskSummaryOutput> {
  return addressRiskSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'addressRiskSummaryPrompt',
  input: {schema: AddressRiskSummaryInputSchema},
  output: {schema: AddressRiskSummaryOutputSchema},
  tools: [getTransactionsTool],
  prompt: `You are an expert in cryptocurrency risk analysis.

You will analyze the given cryptocurrency address and provide a summary of the potential risks associated with it.

Use the getTransactionHistory tool to fetch the latest transactions. Analyze this data to identify risks.
Consider factors like transaction history, velocity, contract interactions, token holdings, and any known associations with illicit activities.
If transaction history is available, mention it in your summary. If it is not available or an error occurs, state that you were unable to retrieve transaction data.

Your summary should start with an immediate risk level assessment: "Low Risk:", "Medium Risk:", or "High Risk:".

Address: {{{address}}}
Blockchain: {{{blockchain}}}

Summary:`,
});

const addressRiskSummaryFlow = ai.defineFlow(
  {
    name: 'addressRiskSummaryFlow',
    inputSchema: AddressRiskSummaryInputSchema,
    outputSchema: AddressRiskSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
