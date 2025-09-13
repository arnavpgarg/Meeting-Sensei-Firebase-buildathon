import { config } from 'dotenv';
config();

import '@/ai/flows/extract-key-decisions.ts';
import '@/ai/flows/categorize-meeting-by-topic.ts';
import '@/ai/flows/analyze-meeting-sentiment.ts';
import '@/ai/flows/summarize-meeting-transcript.ts';
import '@/ai/flows/generate-action-timeline.ts';
import '@/ai/flows/transcribe-video.ts';
