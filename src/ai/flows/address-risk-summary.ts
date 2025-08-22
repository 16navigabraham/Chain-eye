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

export async function getAddressRiskSummary(input: AddressRiskSummaryInput): Promise<AddressRiskSummaryOutput> {
  return addressRiskSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'addressRiskSummaryPrompt',
  input: {schema: AddressRiskSummaryInputSchema},
  output: {schema: AddressRiskSummaryOutputSchema},
  prompt: `You are an expert in cryptocurrency risk analysis.

You will analyze the given cryptocurrency address and provide a summary of the potential risks associated with it.
Consider factors like transaction history, contract interactions, token holdings, and any known associations with illicit activities.

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
