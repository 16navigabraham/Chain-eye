'use server';
/**
 * @fileOverview A simple chatbot flow for answering crypto questions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatbotInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.array(z.object({
        text: z.string(),
    })),
  })).describe('The chat history.'),
  message: z.string().describe('The latest user message.'),
  address: z.string().describe('The crypto address currently being analyzed.'),
  blockchain: z.string().describe('The blockchain currently being analyzed.'),
});

export type ChatbotInput = z.infer<typeof ChatbotInputSchema>;

const ChatbotOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});

export type ChatbotOutput = z.infer<typeof ChatbotOutputSchema>;

export async function askChatbot(input: ChatbotInput): Promise<ChatbotOutput> {
    return chatbotFlow(input);
}


const prompt = ai.definePrompt({
    name: 'chatbotPrompt',
    input: {schema: ChatbotInputSchema},
    output: {schema: ChatbotOutputSchema},
    prompt: `You are ChainEye, a friendly and helpful AI assistant specialized in cryptocurrency analysis.

Your goal is to answer user questions clearly and concisely.

You are currently analyzing the following address:
Address: {{{address}}}
Blockchain: {{{blockchain}}}

Use this context to provide more relevant answers if the user asks about the current analysis. For general crypto questions, provide accurate information. Keep your answers brief and to the point.

The user's message is: {{{message}}}
`,
});


const chatbotFlow = ai.defineFlow(
    {
        name: 'chatbotFlow',
        inputSchema: ChatbotInputSchema,
        outputSchema: ChatbotOutputSchema,
    },
    async (input) => {
        const {output} = await prompt(input);
        return output!;
    }
);
