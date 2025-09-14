'use client';

import {useState} from 'react';
import type {Analysis} from '@/lib/types';
import {
  analyzeTranscript,
  analyzeVideo,
  analyzeDocument,
} from '@/lib/actions';
import {useToast} from '@/hooks/use-toast';
import {TranscriptInput} from '@/components/transcript-input';
import {AnalysisView} from '@/components/analysis-view';
import {AnalysisSkeleton} from '@/components/analysis-skeleton';
import {LiveSummary} from './live-summary';

export function Dashboard() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const {toast} = useToast();

  const handleReset = () => {
    setAnalysis(null);
    setTranscript('');
  };

  const handleAnalyze = async (
    currentTranscript: string,
    file?: File,
    language?: string
  ) => {
    if (isLoading) return;
    setIsLoading(true);
    setTranscript(currentTranscript);
    setAnalysis(null);

    let result;
    try {
      if (file) {
        const dataUri = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
        });

        if (file.type.startsWith('video/')) {
          result = await analyzeVideo(dataUri, language);
        } else {
          result = await analyzeDocument(dataUri, language);
        }
      } else {
        result = await analyzeTranscript(currentTranscript, language);
      }
      handleResult(result);
    } catch (e) {
      console.error('Analysis failed', e);
      handleResult({
        data: null,
        error: e instanceof Error ? e.message : 'An unknown error occurred.',
      });
    }
  };

  const handleResult = (result: {
    data: Analysis | null;
    error: string | null;
  }) => {
    setIsLoading(false);
    if (result.error) {
      toast({
        variant: 'destructive',
        title: result.data ? 'Partial Analysis' : 'Analysis Failed',
        description: result.error,
      });
    }
    if (result.data) {
      setAnalysis(result.data);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      {isLoading ? (
        <AnalysisSkeleton />
      ) : analysis ? (
        <AnalysisView analysis={analysis} onReset={handleReset} />
      ) : (
        <div className="space-y-8">
          <TranscriptInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            transcript={transcript}
            setTranscript={setTranscript}
          />
          <LiveSummary transcript={transcript} />
        </div>
      )}
    </div>
  );
}
