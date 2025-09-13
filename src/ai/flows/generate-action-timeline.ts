'use server';

/**
 * @fileOverview Generates a timeline of actions discussed during a meeting.
 *
 * - generateActionTimeline - A function that generates the action timeline.
 * - GenerateActionTimelineInput - The input type for the generateActionTimeline function.
 * - GenerateActionTimelineOutput - The return type for the generateActionTimeline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateActionTimelineInputSchema = z.object({
  transcript: z
    .string()
    .describe('The transcript of the meeting to generate the timeline from.'),
});
export type GenerateActionTimelineInput = z.infer<typeof GenerateActionTimelineInputSchema>;

const GenerateActionTimelineOutputSchema = z.object({
  timeline: z
    .string()
    .describe(
      'A timeline of actions discussed during the meeting, including dates and descriptions for each action, in markdown format.'
    ),
});
export type GenerateActionTimelineOutput = z.infer<typeof GenerateActionTimelineOutputSchema>;

export async function generateActionTimeline(
  input: GenerateActionTimelineInput
): Promise<GenerateActionTimelineOutput> {
  return generateActionTimelineFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateActionTimelinePrompt',
  input: {schema: GenerateActionTimelineInputSchema},
  output: {schema: GenerateActionTimelineOutputSchema},
  prompt: `You are an AI assistant specialized in generating action timelines from meeting transcripts.
  Your goal is to extract key actions, deadlines, and responsibilities discussed during the meeting and present them in a clear, concise timeline format.

  Analyze the following meeting transcript:
  {{transcript}}

  Identify specific actions, the dates they are due (if mentioned), and who is responsible for each action.
  Format the timeline in markdown. If a date is not specified, then omit it.

  Example format:
  ## Action Timeline:

  - **Action:** [Describe the action]
    - **Date:** [Date of the action]
    - **Responsible:** [Person responsible]

  - **Action:** [Describe the action]
    - **Date:** [Date of the action]
    - **Responsible:** [Person responsible]
  `,
});

const generateActionTimelineFlow = ai.defineFlow(
  {
    name: 'generateActionTimelineFlow',
    inputSchema: GenerateActionTimelineInputSchema,
    outputSchema: GenerateActionTimelineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
