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

const TimelineItemSchema = z.object({
  action: z.string().describe('A concise description of the action or task.'),
  responsible: z
    .string()
    .optional()
    .describe('The person or team responsible for the action.'),
  startDate: z
    .string()
    .optional()
    .describe("The start date of the action in 'YYYY-MM-DD' format."),
  endDate: z
    .string()
    .optional()
    .describe("The end date or deadline for the action in 'YYYY-MM-DD' format."),
  duration: z
    .number()
    .optional()
    .describe(
      'The estimated duration of the action in days. Provide this if dates are not specific.'
    ),
});

const GenerateActionTimelineOutputSchema = z.object({
  timeline: z
    .array(TimelineItemSchema)
    .describe('A list of action items with their details.'),
  ganttChartMarkdown: z
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
  Your goal is to extract key actions, deadlines, and responsibilities discussed during the meeting.

  Analyze the following meeting transcript:
  {{{transcript}}}

  Identify specific actions, who is responsible, and the start and end dates for each action.
  - Today's date is ${new Date().toISOString().split('T')[0]}.
  - If a specific start or end date is mentioned, use it. Dates should be in 'YYYY-MM-DD' format.
  - If only a deadline is mentioned, use it as the 'endDate'.
  - If a duration is mentioned (e.g., "in 3 days", "for a week"), calculate the 'duration' in days.
  - If no dates are specified, you can omit date and duration fields.

  Return both a structured JSON array of timeline items and a markdown representation of the timeline.

  Example markdown format:
  ## Action Timeline:

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
