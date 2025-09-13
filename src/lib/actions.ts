'use server';

import { summarizeMeetingTranscript } from '@/ai/flows/summarize-meeting-transcript';
import type { SummarizeMeetingTranscriptOutput } from '@/ai/flows/summarize-meeting-transcript';
import { extractKeyDecisions } from '@/ai/flows/extract-key-decisions';
import { categorizeMeeting } from '@/ai/flows/categorize-meeting-by-topic';
import { analyzeMeetingSentiment } from '@/ai/flows/analyze-meeting-sentiment';
import { generateActionTimeline } from '@/ai/flows/generate-action-timeline';
import { transcribeVideo } from '@/ai/flows/transcribe-video';
import { transcribeDocument } from '@/ai/flows/transcribe-document';
import { extractTeamTasks } from '@/ai/flows/extract-team-tasks';
import type { Analysis } from './types';
import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

async function runAnalysis(
  transcript: string,
  language?: string
): Promise<{ data: Analysis | null; error: string | null; id?: string }> {
  if (!transcript || transcript.trim().length < 20) {
    return {
      data: null,
      error: 'Transcript is too short. Please provide a more detailed transcript.',
    };
  }
  try {
    const [
      summary,
      keyDecisions,
      category,
      sentiment,
      timeline,
      teamTasks,
    ] = await Promise.all([
      summarizeMeetingTranscript({ transcript, language }),
      extractKeyDecisions({ transcript }),
      categorizeMeeting({ transcript }),
      analyzeMeetingSentiment({ transcript }),
      generateActionTimeline({ transcript }),
      extractTeamTasks({ transcript }),
    ]);

    const analysisData: Analysis = {
      summary,
      keyDecisions,
      category,
      sentiment,
      timeline,
      teamTasks,
    };

    const docRef = await addDoc(collection(db, 'meetings'), {
      ...analysisData,
      transcript,
      createdAt: serverTimestamp(),
    });

    return {
      data: analysisData,
      error: null,
      id: docRef.id,
    };
  } catch (e) {
    console.error('Error during AI analysis:', e);
    return {
      data: null,
      error: 'An error occurred during analysis. Please try again.',
    };
  }
}

export async function analyzeTranscript(
  transcript: string,
  language?: string
): Promise<{ data: Analysis | null; error: string | null; id?: string }> {
  return runAnalysis(transcript, language);
}

export async function analyzeVideo(
  videoDataUri: string,
  language?: string
): Promise<{ data: Analysis | null; error: string | null; id?: string }> {
  try {
    const { transcript } = await transcribeVideo({ videoDataUri });
    if (!transcript) {
      return { data: null, error: 'Could not transcribe the video.' };
    }
    return runAnalysis(transcript, language);
  } catch (e) {
    console.error('Error during video analysis:', e);
    return {
      data: null,
      error: 'An error occurred during video analysis. Please try again.',
    };
  }
}

export async function analyzeDocument(
  documentDataUri: string,
  language?: string
): Promise<{ data: Analysis | null; error: string | null; id?: string }> {
  try {
    const { transcript } = await transcribeDocument({ documentDataUri });
    if (!transcript) {
      return { data: null, error: 'Could not extract text from the document.' };
    }
    return runAnalysis(transcript, language);
  } catch (e) {
    console.error('Error during document analysis:', e);
    return {
      data: null,
      error: 'An error occurred during document analysis. Please try again.',
    };
  }
}

export async function getLiveSummary(
  transcript: string,
  language?: string
): Promise<{ data: SummarizeMeetingTranscriptOutput | null; error: string | null }> {
  if (!transcript || transcript.trim().length < 20) {
    return {
      data: null,
      error: 'Transcript is too short to summarize.',
    };
  }

  try {
    const summary = await summarizeMeetingTranscript({ transcript, language });
    return { data: summary, error: null };
  } catch (e) {
    console.error('Error during live summary generation:', e);
    return {
      data: null,
      error: 'An error occurred while generating the summary. Please try again.',
    };
  }
}
