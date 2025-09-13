'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Analysis } from '@/lib/types';
import {
  analyzeTranscript,
  analyzeVideo,
  analyzeDocument,
} from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { TranscriptInput } from '@/components/transcript-input';
import { AnalysisView } from '@/components/analysis-view';
import { AnalysisSkeleton } from '@/components/analysis-skeleton';
import { LiveSummary } from './live-summary';

export function Dashboard() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleReset = () => {
    setAnalysis(null);
    setTranscript('');
    setMeetingId(null);
  };

  const handleAnalyze = async (
    currentTranscript: string,
    file?: File,
    language?: string
  ) => {
    if (isLoading) return;
    setIsLoading(true);
    setAnalysis(null);
    setTranscript(currentTranscript);

    let result;
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const dataUri = reader.result as string;
        if (file.type.startsWith('video/')) {
          result = await analyzeVideo(dataUri, language);
        } else {
          result = await analyzeDocument(dataUri, language);
        }
        handleResult(result);
      };
      reader.onerror = () => {
        handleResult({
          data: null,
          error: 'Failed to read the file.',
        });
      };
    } else {
      result = await analyzeTranscript(currentTranscript, language);
      handleResult(result);
    }
  };

  const handleResult = (result: {
    data: Analysis | null;
    error: string | null;
    id?: string;
  }) => {
    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: result.error,
      });
    }

    if (result.data) {
      setAnalysis(result.data);
      if (result.id) {
        setMeetingId(result.id);
        // Navigate to the new meeting details page to show the result
        router.push(`/meeting/${result.id}`);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      {isLoading ? (
        <AnalysisSkeleton />
      ) : analysis && meetingId ? (
         <AnalysisView analysis={analysis} onReset={handleReset} meetingId={meetingId} />
      ) : (
        <div className="space-y-8">
          <TranscriptInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            transcript={transcript}
            setTranscript={setTranscript}
          />
          <LiveSummary
            transcript={transcript}
          />
        </div>
      )}
    </div>
  );
}
