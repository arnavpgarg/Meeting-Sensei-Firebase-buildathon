'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { GanttChart } from '@/components/gantt-chart';
import type { GenerateActionTimelineOutput } from '@/ai/flows/generate-action-timeline';

type TimelineItem = GenerateActionTimelineOutput['timeline'][0];

function TimelineContent() {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  useEffect(() => {
    if (data) {
      try {
        const timelineData = JSON.parse(data) as GenerateActionTimelineOutput;
        if (timelineData.timeline) {
          setTimeline(timelineData.timeline);
        }
      } catch (error) {
        console.error('Failed to parse timeline data', error);
      }
    }
  }, [data]);
  
  if (!data) {
     return (
        <p className="text-center text-muted-foreground">
          No timeline data provided. Please perform an analysis first.
        </p>
     )
  }

  return (
     <div className="h-[600px] pt-6">
      {timeline.length > 0 ? (
        <GanttChart data={timeline} />
      ) : (
        <p className="text-center text-muted-foreground">
          No timeline data available to display.
        </p>
      )}
    </div>
  )
}


export default function TimelinePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center mb-6">
        <Button asChild variant="ghost" size="icon">
          <Link href="/">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold ml-2">
          Actions Chart
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p>Loading timeline...</p>}>
             <TimelineContent />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
