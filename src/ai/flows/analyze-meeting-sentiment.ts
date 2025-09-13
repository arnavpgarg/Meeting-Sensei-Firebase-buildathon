'use server';

/**
 * @fileOverview A meeting sentiment analysis AI agent.
 *
 * - analyzeMeetingSentiment - A function that handles the meeting sentiment analysis process.
 * - AnalyzeMeetingSentimentInput - The input type for the analyzeMeetingSentiment function.
 * - AnalyzeMeetingSentimentOutput - The return type for the analyzeMeetingSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMeetingSentimentInputSchema = z.object({
  transcript: z.string().describe('The transcript of the meeting.'),
});
export type AnalyzeMeetingSentimentInput = z.infer<typeof AnalyzeMeetingSentimentInputSchema>;

const AnalyzeMeetingSentimentOutputSchema = z.object({
  sentiment: z
    .enum(['positive', 'negative', 'neutral'])
    .describe('The overall sentiment of the meeting.'),
  reason: z.string().describe('The reason for the sentiment.'),
});
export type AnalyzeMeetingSentimentOutput = z.infer<typeof AnalyzeMeetingSentimentOutputSchema>;

export async function analyzeMeetingSentiment(
  input: AnalyzeMeetingSentimentInput
): Promise<AnalyzeMeetingSentimentOutput> {
  return analyzeMeetingSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMeetingSentimentPrompt',
  input: {schema: AnalyzeMeetingSentimentInputSchema},
  output: {schema: AnalyzeMeetingSentimentOutputSchema},
  prompt: `You are an AI assistant specializing in analyzing meeting transcripts to determine the overall sentiment.

  Analyze the following meeting transcript and determine if the overall sentiment is positive, negative, or neutral. Provide a brief reason for your assessment.

  Transcript: {{{transcript}}}

  Return the sentiment as one of 'positive', 'negative', or 'neutral'.`,
});

const analyzeMeetingSentimentFlow = ai.defineFlow(
  {
    name: 'analyzeMeetingSentimentFlow',
    inputSchema: AnalyzeMeetingSentimentInputSchema,
    outputSchema: AnalyzeMeetingSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
