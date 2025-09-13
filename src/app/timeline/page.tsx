'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { GanttChart } from '@/components/gantt-chart';
import type { GenerateActionTimelineOutput } from '@/ai/flows/generate-action-timeline';

type TimelineItem = GenerateActionTimelineOutput['timeline'][0];

export default function TimelinePage() {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  useEffect(() => {
    const storedAnalysis = localStorage.getItem('meetingAnalysis');
    if (storedAnalysis) {
      const analysis = JSON.parse(storedAnalysis);
      if (analysis.timeline && analysis.timeline.timeline) {
        setTimeline(analysis.timeline.timeline);
      }
    }
  }, []);

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
