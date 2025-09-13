'use server';

import { summarizeMeetingTranscript } from '@/ai/flows/summarize-meeting-transcript';
import { extractKeyDecisions } from '@/ai/flows/extract-key-decisions';
import { categorizeMeeting } from '@/ai/flows/categorize-meeting-by-topic';
import { analyzeMeetingSentiment } from '@/ai/flows/analyze-meeting-sentiment';
import { generateActionTimeline } from '@/ai/flows/generate-action-timeline';
import type { Analysis } from './types';

export async function analyzeTranscript(
  transcript: string
): Promise<{ data: Analysis | null; error: string | null }> {
  if (!transcript || transcript.trim().length < 50) {
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
