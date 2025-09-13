'use server';

/**
 * @fileOverview Extracts tasks assigned to team members from a meeting transcript.
 *
 * - extractTeamTasks - A function that extracts tasks assigned to team members.
 * - ExtractTeamTasksInput - The input type for the extractTeamTasks function.
 * - ExtractTeamTasksOutput - The return type for the extractTeamTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTeamTasksInputSchema = z.object({
  transcript: z.string().describe('The transcript of the meeting.'),
});
export type ExtractTeamTasksInput = z.infer<typeof ExtractTeamTasksInputSchema>;

const TaskSchema = z.object({
  assignee: z.string().describe('The name of the person the task is assigned to.'),
  task: z.string().describe('The description of the task.'),
  deadline: z.string().optional().describe('The deadline for the task.'),
});

const ExtractTeamTasksOutputSchema = z.object({
  tasks: z.array(TaskSchema).describe('The tasks assigned to team members.'),
});
export type ExtractTeamTasksOutput = z.infer<typeof ExtractTeamTasksOutputSchema>;

export async function extractTeamTasks(
  input: ExtractTeamTasksInput
): Promise<ExtractTeamTasksOutput> {
  return extractTeamTasksFlow(input);
}

const extractTeamTasksPrompt = ai.definePrompt({
  name: 'extractTeamTasksPrompt',
  input: {schema: ExtractTeamTasksInputSchema},
  output: {schema: ExtractTeamTasksOutputSchema},
  prompt: `You are an AI assistant helping to extract tasks assigned to team members from meeting transcripts.

  Analyze the following meeting transcript and extract the tasks assigned to each team member.
  For each task, identify the assignee, the task description, and the deadline if mentioned.
  Format the output as a JSON array of objects, where each object has 'assignee', 'task', and 'deadline' keys.

  Transcript: {{{transcript}}}`,
});

const extractTeamTasksFlow = ai.defineFlow(
  {
    name: 'extractTeamTasksFlow',
    inputSchema: ExtractTeamTasksInputSchema,
    outputSchema: ExtractTeamTasksOutputSchema,
  },
  async input => {
    const {output} = await extractTeamTasksPrompt(input);
    return output!;
  }
);
