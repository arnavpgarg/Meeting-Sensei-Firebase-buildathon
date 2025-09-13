'use server';

/**
 * @fileOverview Transcribes a video file into text.
 *
 * - transcribeVideo - A function that takes a video and returns its transcription.
 * - TranscribeVideoInput - The input type for the transcribeVideo function.
 * - TranscribeVideoOutput - The return type for the transcribeVideo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeVideoInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video of a meeting, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeVideoInput = z.infer<typeof TranscribeVideoInputSchema>;

const TranscribeVideoOutputSchema = z.object({
  transcript: z.string().describe('The transcript of the video.'),
});
export type TranscribeVideoOutput = z.infer<typeof TranscribeVideoOutputSchema>;

export async function transcribeVideo(
  input: TranscribeVideoInput
): Promise<TranscribeVideoOutput> {
  return transcribeVideoFlow(input);
}

const transcribeVideoPrompt = ai.definePrompt({
  name: 'transcribeVideoPrompt',
  input: {schema: TranscribeVideoInputSchema},
  output: {schema: TranscribeVideoOutputSchema},
  prompt: `You are a video transcription service. Transcribe the following video.

  Video: {{media url=videoDataUri}}
  
  Transcript:`,
  model: 'googleai/gemini-2.5-flash',
});

const transcribeVideoFlow = ai.defineFlow(
  {
    name: 'transcribeVideoFlow',
    inputSchema: TranscribeVideoInputSchema,
    outputSchema: TranscribeVideoOutputSchema,
  },
  async input => {
    const {output} = await transcribeVideoPrompt(input);
    return output!;
  }
);
