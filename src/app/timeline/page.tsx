'use client';

import {Suspense, useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {GanttChart} from '@/components/gantt-chart';
import type {GenerateActionTimelineOutput} from '@/ai/flows/generate-action-timeline';
import {AnalysisSkeleton} from '@/components/analysis-skeleton';
import {Header} from '@/components/header';

type TimelineItem = GenerateActionTimelineOutput['timeline'][0];

function TimelineContent() {
  const searchParams = useSearchParams();
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const timelineData: GenerateActionTimelineOutput = JSON.parse(
          decodeURIComponent(data)
        );
        setTimeline(timelineData.timeline);
      } catch (error) {
        console.error('Failed to parse timeline data:', error);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return <AnalysisSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <h1 className="font-headline text-3xl font-bold mb-6">Actions Chart</h1>
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent className="h-[600px] pt-6">
          {timeline.length > 0 ? (
            <GanttChart data={timeline} />
          ) : (
            <p className="text-center text-muted-foreground">
              No timeline data available to display.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function TimelinePage() {
  return (
    <>
      <Header />
      <Suspense fallback={<AnalysisSkeleton />}>
        <TimelineContent />
      </Suspense>
    </>
  );
}
