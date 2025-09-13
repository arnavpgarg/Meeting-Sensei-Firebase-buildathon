'use server';

/**
 * @fileOverview Summarizes a meeting transcript into key discussion points.
 *
 * - summarizeMeetingTranscript - A function that takes a meeting transcript and returns a summary.
 * - SummarizeMeetingTranscriptInput - The input type for the summarizeMeetingTranscript function.
 * - SummarizeMeetingTranscriptOutput - The return type for the summarizeMeetingTranscript function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeMeetingTranscriptInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the meeting to be summarized.'),
});
export type SummarizeMeetingTranscriptInput = z.infer<
  typeof SummarizeMeetingTranscriptInputSchema
>;

const SummarizeMeetingTranscriptOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the key discussion points.'),
});
export type SummarizeMeetingTranscriptOutput = z.infer<
  typeof SummarizeMeetingTranscriptOutputSchema
>;

export async function summarizeMeetingTranscript(
  input: SummarizeMeetingTranscriptInput
): Promise<SummarizeMeetingTranscriptOutput> {
  return summarizeMeetingTranscriptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeMeetingTranscriptPrompt',
  input: {schema: SummarizeMeetingTranscriptInputSchema},
  output: {schema: SummarizeMeetingTranscriptOutputSchema},
  prompt: `Summarize the following meeting transcript into less than 5 bullet points:\n\nTranscript: {{{transcript}}}`,
});

const summarizeMeetingTranscriptFlow = ai.defineFlow(
  {
    name: 'summarizeMeetingTranscriptFlow',
    inputSchema: SummarizeMeetingTranscriptInputSchema,
    outputSchema: SummarizeMeetingTranscriptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
