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
import { redirect } from 'next/navigation';


async function runAnalysis(
  transcript: string,
  language?: string
): Promise<{ data: Analysis | null; error: string | null; meetingId?: string; }> {
  if (!transcript || transcript.trim().length < 20) {
    return {
      data: null,
      error: 'Transcript is too short. Please provide a more detailed transcript.',
    };
  }
  try {
    const results = await Promise.allSettled([
      summarizeMeetingTranscript({ transcript, language }),
      extractKeyDecisions({ transcript }),
      categorizeMeeting({ transcript }),
      analyzeMeetingSentiment({ transcript }),
      generateActionTimeline({ transcript }),
      extractTeamTasks({ transcript }),
    ]);

    const errors = results
      .map((r, i) => (r.status === 'rejected' ? `Task ${i} failed: ${r.reason}`: null))
      .filter(Boolean);

    if (errors.length > 0) {
      console.error('Some analysis tasks failed:', errors.join('\n'));
    }

    const [
      summary,
      keyDecisions,
      category,
      sentiment,
      timeline,
      teamTasks,
    ] = results.map(r => r.status === 'fulfilled' ? r.value : null);


    const analysisData: Analysis = {
      summary: summary || { summary: 'Summary could not be generated.' },
      keyDecisions: keyDecisions || { decisions: [] },
      category: category || { category: 'other' },
      sentiment: sentiment || { sentiment: 'neutral', reason: 'Sentiment analysis failed.' },
      timeline: timeline || { timeline: [], ganttChartMarkdown: 'Timeline could not be generated.' },
      teamTasks: teamTasks || { tasks: [] },
      transcript,
      createdAt: serverTimestamp(),
    };
    
    let errorMessage = null;
    if (errors.length === results.length) {
      errorMessage = 'All analysis tasks failed. Please try again.';
      return { data: null, error: errorMessage };
    } else if (errors.length > 0) {
      errorMessage = `Some analysis tasks failed, but we recovered partial results. Failures: ${errors.join(', ')}`;
    }
    
     const docRef = await addDoc(collection(db, 'meetings'), analysisData);


    return {
      data: analysisData,
      error: errorMessage,
      meetingId: docRef.id,
    };
  } catch (e) {
    console.error('Error during AI analysis:', e);
    return {
      data: null,
      error: 'An unexpected error occurred during analysis. Please try again.',
    };
  }
}

async function handleAnalysisAndRedirect(
  analysisPromise: Promise<{ data: Analysis | null; error: string | null; meetingId?: string; }>
) {
  const result = await analysisPromise;
  if (result.error && !result.data) {
    // Full failure, we can't redirect. The client will handle showing the toast.
    return result;
  }
  
  if (result.meetingId) {
    redirect(`/meeting/${result.meetingId}`);
  }
  
  // This return is for the client-side, in case redirect doesn't happen,
  // although it should with the logic above.
  return result;
}

export async function analyzeTranscript(
  transcript: string,
  language?: string
) {
  return handleAnalysisAndRedirect(runAnalysis(transcript, language));
}

export async function analyzeVideo(
  videoDataUri: string,
  language?: string
) {
  try {
    const { transcript } = await transcribeVideo({ videoDataUri });
    if (!transcript) {
      return { data: null, error: 'Could not transcribe the video.' };
    }
    return handleAnalysisAndRedirect(runAnalysis(transcript, language));
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
) {
  try {
    const { transcript } = await transcribeDocument({ documentDataUri });
    if (!transcript) {
      return { data: null, error: 'Could not extract text from the document.' };
    }
    return handleAnalysisAndRedirect(runAnalysis(transcript, language));
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