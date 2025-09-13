'use client';

import { FileText, Loader2, Sparkles, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type TranscriptInputProps = {
  onAnalyze: (transcript: string) => void;
  isLoading: boolean;
  transcript: string;
  setTranscript: (transcript: string) => void;
};

export function TranscriptInput({
  onAnalyze,
  isLoading,
  transcript,
  setTranscript,
}: TranscriptInputProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center">
            Upload Your Meeting Transcript
          </CardTitle>
          <CardDescription className="text-center">
            Paste your transcript below or upload a file to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <Textarea
              placeholder="Paste your meeting transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="min-h-[300px] text-base"
              disabled={isLoading}
            />
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>PDF, TXT</span>
                </div>
                <div className="flex items-center gap-2">
                  <Film className="h-4 w-4" />
                  <span>MP4, WebM</span>
                </div>
              </div>
              <Button
                size="lg"
                onClick={() => onAnalyze(transcript)}
                disabled={isLoading || !transcript.trim()}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles className="mr-2" />
                )}
                Analyze Transcript
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
