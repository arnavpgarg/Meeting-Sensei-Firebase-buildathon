'use server';

/**
 * @fileOverview This file defines a Genkit flow for categorizing meetings based on their content.
 *
 * The flow takes meeting transcript as input and returns the meeting category.
 * @fileOverview Meeting categorization AI agent.
 *
 * - categorizeMeeting - A function that categorizes the meeting.
 * - CategorizeMeetingInput - The input type for the categorizeMeeting function.
 * - CategorizeMeetingOutput - The return type for the categorizeMeeting function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizeMeetingInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the meeting to categorize.'),
});
export type CategorizeMeetingInput = z.infer<typeof CategorizeMeetingInputSchema>;

const CategorizeMeetingOutputSchema = z.object({
  category: z
    .string()
    .describe(
      'The category of the meeting, chosen from: project update, client call, hiring discussion, budgeting, other.'
    ),
});
export type CategorizeMeetingOutput = z.infer<typeof CategorizeMeetingOutputSchema>;

export async function categorizeMeeting(input: CategorizeMeetingInput): Promise<CategorizeMeetingOutput> {
  return categorizeMeetingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizeMeetingPrompt',
  input: {schema: CategorizeMeetingInputSchema},
  output: {schema: CategorizeMeetingOutputSchema},
  prompt: `You are an expert meeting categorizer. You will be given a meeting transcript and you will determine the category of the meeting. The possible categories are: project update, client call, hiring discussion, budgeting, other.

Transcript: {{{transcript}}}

Category: `,
});

const categorizeMeetingFlow = ai.defineFlow(
  {
    name: 'categorizeMeetingFlow',
    inputSchema: CategorizeMeetingInputSchema,
    outputSchema: CategorizeMeetingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
