'use server';

import { summarizeMeetingTranscript } from '@/ai/flows/summarize-meeting-transcript';
import { extractKeyDecisions } from '@/ai/flows/extract-key-decisions';
import { categorizeMeeting } from '@/ai/flows/categorize-meeting-by-topic';
import { analyzeMeetingSentiment } from '@/ai/flows/analyze-meeting-sentiment';
import { generateActionTimeline } from '@/ai/flows/generate-action-timeline';
import { transcribeVideo } from '@/ai/flows/transcribe-video';
import type { Analysis } from './types';

async function runAnalysis(
  transcript: string
): Promise<{ data: Analysis | null; error: string | null }> {
  if (!transcript || transcript.trim().length < 20) {
    return {
      data: null,
      error: 'Transcript is too short. Please provide a more detailed transcript.',
    };
  }
  try {
    const [summary, keyDecisions, category, sentiment, timeline] =
      await Promise.all([
        summarizeMeetingTranscript({ transcript }),
        extractKeyDecisions({ transcript }),
        categorizeMeeting({ transcript }),
        analyzeMeetingSentiment({ transcript }),
        generateActionTimeline({ transcript }),
      ]);

    return {
      data: { summary, keyDecisions, category, sentiment, timeline },
      error: null,
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
  transcript: string
): Promise<{ data: Analysis | null; error: string | null }> {
  return runAnalysis(transcript);
}

export async function analyzeVideo(
  videoDataUri: string
): Promise<{ data: Analysis | null; error: string | null }> {
  try {
    const { transcript } = await transcribeVideo({ videoDataUri });
    if (!transcript) {
      return { data: null, error: 'Could not transcribe the video.' };
    }
    return runAnalysis(transcript);
  } catch (e) {
    console.error('Error during video analysis:', e);
    return {
      data: null,
      error: 'An error occurred during video analysis. Please try again.',
    };
  }
}
