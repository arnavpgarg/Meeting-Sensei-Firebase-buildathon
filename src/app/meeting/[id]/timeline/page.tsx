'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { GanttChart } from '@/components/gantt-chart';
import type { GenerateActionTimelineOutput } from '@/ai/flows/generate-action-timeline';
import type { Analysis } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

type TimelineItem = GenerateActionTimelineOutput['timeline'][0];

export default function NewTimelinePage() {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      const fetchTimeline = async () => {
        try {
          const docRef = doc(db, 'meetings', id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const analysis = docSnap.data() as Analysis;
            if (analysis.timeline && analysis.timeline.timeline) {
              setTimeline(analysis.timeline.timeline);
            }
          } else {
            setError('Meeting not found.');
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch timeline data.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchTimeline();
    }
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center mb-6">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/meeting/${id}`}>
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
          {isLoading ? (
             <Skeleton className="h-full w-full" />
          ) : error ? (
            <p className="text-center text-destructive">{error}</p>
          ) : timeline.length > 0 ? (
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
