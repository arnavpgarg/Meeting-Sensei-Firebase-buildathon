import type { SummarizeMeetingTranscriptOutput } from '@/ai/flows/summarize-meeting-transcript';
import type { ExtractKeyDecisionsOutput } from '@/ai/flows/extract-key-decisions';
import type { CategorizeMeetingOutput } from '@/ai/flows/categorize-meeting-by-topic';
import type { AnalyzeMeetingSentimentOutput } from '@/ai/flows/analyze-meeting-sentiment';
import type { GenerateActionTimelineOutput } from '@/ai/flows/generate-action-timeline';
import type { TranscribeVideoOutput } from '@/ai/flows/transcribe-video';

export type Analysis = {
  summary: SummarizeMeetingTranscriptOutput;
  keyDecisions: ExtractKeyDecisionsOutput;
  category: CategorizeMeetingOutput;
  sentiment: AnalyzeMeetingSentimentOutput;
  timeline: GenerateActionTimelineOutput;
};

export type Transcription = TranscribeVideoOutput;
