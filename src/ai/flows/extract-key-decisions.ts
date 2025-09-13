// src/ai/flows/extract-key-decisions.ts
'use server';
/**
 * @fileOverview Extracts key decisions from a meeting transcript.
 *
 * - extractKeyDecisions - A function that extracts key decisions from a meeting transcript.
 * - ExtractKeyDecisionsInput - The input type for the extractKeyDecisions function.
 * - ExtractKeyDecisionsOutput - The return type for the extractKeyDecisions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractKeyDecisionsInputSchema = z.object({
  transcript: z.string().describe('The transcript of the meeting.'),
});
export type ExtractKeyDecisionsInput = z.infer<
  typeof ExtractKeyDecisionsInputSchema
>;

const DecisionSchema = z.object({
  decision: z.string().describe('The key decision made.'),
  reason: z.string().describe('The reason for the decision.'),
  actionItems: z.array(z.string()).describe('The action items for the decision.'),
});

const ExtractKeyDecisionsOutputSchema = z.object({
  decisions: z.array(DecisionSchema).describe('The key decisions made during the meeting.'),
});
export type ExtractKeyDecisionsOutput = z.infer<
  typeof ExtractKeyDecisionsOutputSchema
>;

export async function extractKeyDecisions(
  input: ExtractKeyDecisionsInput
): Promise<ExtractKeyDecisionsOutput> {
  return extractKeyDecisionsFlow(input);
}

const extractKeyDecisionsPrompt = ai.definePrompt({
  name: 'extractKeyDecisionsPrompt',
  input: {schema: ExtractKeyDecisionsInputSchema},
  output: {schema: ExtractKeyDecisionsOutputSchema},
  prompt: `You are an AI assistant helping to extract key decisions from meeting transcripts.

  Analyze the following meeting transcript and extract the key decisions made, the reasons for those decisions, and any action items associated with each decision.
  Format the output as a JSON array of objects, where each object has 'decision', 'reason', and 'actionItems' keys.

  Transcript: {{{transcript}}}`,
});

const extractKeyDecisionsFlow = ai.defineFlow(
  {
    name: 'extractKeyDecisionsFlow',
    inputSchema: ExtractKeyDecisionsInputSchema,
    outputSchema: ExtractKeyDecisionsOutputSchema,
  },
  async input => {
    const {output} = await extractKeyDecisionsPrompt(input);
    return output!;
  }
);
