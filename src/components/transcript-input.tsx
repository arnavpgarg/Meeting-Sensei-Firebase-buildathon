'use client';

import { FileText, Loader2, Sparkles, Film, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useRef, useState } from 'react';
import { Input } from './ui/input';

type TranscriptInputProps = {
  onAnalyze: (transcript: string, file?: File) => void;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setTranscript(`Analyzing file: ${selectedFile.name}`);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyzeClick = () => {
    if (file) {
      onAnalyze('', file);
    } else {
      onAnalyze(transcript);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-center">
            Upload Your Meeting Recording
          </CardTitle>
          <CardDescription className="text-center">
            Paste a transcript, or upload a video, PDF, or text file to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <Textarea
              placeholder="Paste your meeting transcript here..."
              value={transcript}
              onChange={(e) => {
                setTranscript(e.target.value);
                if (file) setFile(null);
              }}
              className="min-h-[300px] text-base"
              disabled={isLoading || !!file}
            />

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center gap-4">
              <Button
                variant="outline"
                onClick={handleUploadClick}
                disabled={isLoading}
              >
                <Upload className="mr-2" />
                Upload File
              </Button>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="video/mp4,video/webm,application/pdf,text/plain"
              />

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Film className="h-4 w-4" />
                  <span>MP4, WebM</span>
                </div>
                 <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span>PDF, TXT</span>
                </div>
              </div>
              <Button
                size="lg"
                onClick={handleAnalyzeClick}
                disabled={isLoading || (!transcript.trim() && !file)}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Sparkles className="mr-2" />
                )}
                Analyze
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
