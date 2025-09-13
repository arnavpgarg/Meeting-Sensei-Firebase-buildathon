'use server';

/**
 * @fileOverview Transcribes a document file (PDF or TXT) into text.
 *
 * - transcribeDocument - A function that takes a document and returns its transcription.
 * - TranscribeDocumentInput - The input type for the transcribeDocument function.
 * - TranscribeDocumentOutput - The return type for the transcribeDocument function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeDocumentInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type TranscribeDocumentInput = z.infer<typeof TranscribeDocumentInputSchema>;

const TranscribeDocumentOutputSchema = z.object({
  transcript: z.string().describe('The transcript of the document.'),
});
export type TranscribeDocumentOutput = z.infer<typeof TranscribeDocumentOutputSchema>;

export async function transcribeDocument(
  input: TranscribeDocumentInput
): Promise<TranscribeDocumentOutput> {
  return transcribeDocumentFlow(input);
}

const transcribeDocumentPrompt = ai.definePrompt({
  name: 'transcribeDocumentPrompt',
  input: {schema: TranscribeDocumentInputSchema},
  output: {schema: TranscribeDocumentOutputSchema},
  prompt: `You are a document transcription service. Extract the text content from the following document.

  Document: {{media url=documentDataUri}}
  
  Transcript:`,
  model: 'googleai/gemini-2.5-flash',
});

const transcribeDocumentFlow = ai.defineFlow(
  {
    name: 'transcribeDocumentFlow',
    inputSchema: TranscribeDocumentInputSchema,
    outputSchema: TranscribeDocumentOutputSchema,
  },
  async input => {
    const {output} = await transcribeDocumentPrompt(input);
    return output!;
  }
);
