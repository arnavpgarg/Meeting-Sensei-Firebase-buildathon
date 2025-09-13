'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from './ui/card';
import { Button } from './ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import { getLiveSummary } from '@/lib/actions';
import { SummaryCard } from './summary-card';
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type LiveSummaryProps = {
  transcript: string;
};

export function LiveSummary({ transcript }: LiveSummaryProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleRefresh = async () => {
    if (!transcript.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Transcript',
        description: 'Please enter some text to generate a summary.',
      });
      return;
    }
    setIsLoading(true);
    const { data, error } = await getLiveSummary(transcript);
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Summary Failed',
        description: error,
      });
    }
    if (data) {
      setSummary(data.summary);
    }
    setIsLoading(false);
  };

  const hasContent = transcript.trim().length > 0;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="font-headline text-3xl">Live Summary</CardTitle>
            <CardDescription>
              Get a summary of your notes as you take them.
            </CardDescription>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isLoading || !hasContent}
          >
            {isLoading ? (
              <Loader2 className="mr-2 animate-spin" />
            ) : (
              <RefreshCw className="mr-2" />
            )}
            Refresh Summary
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
             <Skeleton className="h-4 w-full" />
             <Skeleton className="h-4 w-[90%]" />
             <Skeleton className="h-4 w-[95%]" />
          </div>
        ) : summary ? (
          <SummaryCard summary={summary} />
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>Your live summary will appear here.</p>
            <p className="text-sm">
              Type in the text area above and click "Refresh Summary".
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}