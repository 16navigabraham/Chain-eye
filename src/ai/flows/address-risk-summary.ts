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
import { getTransactionList, getTokenList } from '@/services/etherscan';

const AddressRiskSummaryInputSchema = z.object({
  address: z
    .string()
    .describe('The cryptocurrency address to analyze.'),
  blockchain: z.string().describe('The blockchain network of the address.'),
});
export type AddressRiskSummaryInput = z.infer<typeof AddressRiskSummaryInputSchema>;

const AddressRiskSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the risk factors associated with the address.'),
});
export type AddressRiskSummaryOutput = z.infer<typeof AddressRiskSummaryOutputSchema>;

const getTransactionsTool = ai.defineTool(
  {
    name: 'getTransactionHistory',
    description: 'Get the transaction history for a given cryptocurrency address on a specific blockchain.',
    inputSchema: z.object({
      address: z.string().describe('The cryptocurrency address.'),
      blockchain: z.string().describe('The blockchain network (e.g., ethereum, base_mainnet).'),
    }),
    outputSchema: z.array(z.any()),
  },
  async (input) => {
    console.log(`Using getTransactionHistory tool for address: ${input.address} on ${input.blockchain}`);
    try {
      // We are limiting to the first 100 transactions for this example.
      const transactions = await getTransactionList(input.address, input.blockchain);
      return transactions;
    } catch (e) {
      console.error("Error in getTransactionHistory tool:", e);
      // It's better to return an empty array than to throw an error and fail the whole flow.
      // The LLM can then reason about the lack of data.
      return [];
    }
  }
);

const getTokensTool = ai.defineTool(
  {
    name: 'getTokenHoldings',
    description: 'Get the list of unique tokens held by a given cryptocurrency address on a specific blockchain.',
    inputSchema: z.object({
      address: z.string().describe('The cryptocurrency address.'),
      blockchain: z.string().describe('The blockchain network (e.g., ethereum, base_mainnet).'),
    }),
    outputSchema: z.array(z.any()),
  },
  async (input) => {
    console.log(`Using getTokenHoldings tool for address: ${input.address} on ${input.blockchain}`);
    try {
      const tokens = await getTokenList(input.address, input.blockchain);
      return tokens;
    } catch (e) {
      console.error("Error in getTokenHoldings tool:", e);
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
  tools: [getTransactionsTool, getTokensTool],
  prompt: `You are a senior cryptocurrency risk analyst. Your task is to provide a concise, expert risk assessment of a given crypto address.

You MUST use the provided tools to fetch on-chain data. Your entire analysis will be based on the output of these tools.

Follow these steps precisely:
1.  Call the \`getTransactionHistory\` and \`getTokenHoldings\` tools for the given address and blockchain.
2.  Analyze the results from the tools.
3.  Formulate a risk summary that starts with one of three classifications: "Low Risk:", "Medium Risk:", or "High Risk:".

**Analysis Rules:**

*   **If \`getTransactionHistory\` returns an empty array \`[]\`:** This means NO transactions were found. Your summary MUST state that no transactions were found and conclude the address is likely "Low Risk" due to inactivity. Do NOT state that you were unable to retrieve data.
*   **If transaction history IS available:** Analyze it for risks. Consider transaction volume, frequency, and interactions with known high-risk contracts (though you don't have a list of those, you can infer risk from patterns). Mention key details.
*   **If \`getTokenHoldings\` returns an empty array \`[]\`:** Mention that no tokens were found.
*   **If tokens ARE found:** Mention any tokens that might be considered unusual or high-risk (memecoins, unknown tokens).
*   **If BOTH tools return empty arrays \`[]\`:** State that you were unable to retrieve any on-chain data for the address and therefore cannot perform a risk analysis. This is the ONLY case where you should state data retrieval failed.

Your final output must be a single summary string.

**Address:** {{{address}}}
**Blockchain:** {{{blockchain}}}`,
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
