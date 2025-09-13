'use client';

import { Calendar, User, Flag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useMemo } from 'react';

type TimelineCardProps = {
  timeline: string;
};

type TimelineItem = {
  action: string;
  date?: string;
  responsible?: string;
};

export function TimelineCard({ timeline }: TimelineCardProps) {
  const timelineItems = useMemo<TimelineItem[]>(() => {
    const cleanedTimeline = timeline.replace('## Action Timeline:', '').trim();
    if (!cleanedTimeline) return [];

    const itemBlocks = cleanedTimeline.split(/\n\s*-\s*\*\*Action:\*\*/).slice(1);
    
    return itemBlocks.map(block => {
      const actionMatch = block.match(/(.*?)(?=\n\s*-\s*\*\*|$)/s);
      const dateMatch = block.match(/-\s*\*\*Date:\*\*\s*(.*)/);
      const responsibleMatch = block.match(/-\s*\*\*Responsible:\*\*\s*(.*)/);

      return {
        action: actionMatch ? actionMatch[1].trim() : 'N/A',
        date: dateMatch ? dateMatch[1].trim() : undefined,
        responsible: responsibleMatch ? responsibleMatch[1].trim() : undefined,
      };
    });
  }, [timeline]);

  return (
    <Card className="print-break-inside-avoid">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Action Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        {timelineItems.length > 0 ? (
          <div className="relative space-y-8 pl-6">
            <div className="absolute left-[35px] top-2 h-full w-0.5 bg-border -translate-x-1/2"></div>
            {timelineItems.map((item, index) => (
              <div key={index} className="relative">
                <div className="absolute left-[-23px] top-1.5 h-4 w-4 rounded-full bg-primary ring-4 ring-background"></div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                     <Flag className="h-5 w-5 text-foreground mt-0.5" />
                     <p className="font-semibold">{item.action}</p>
                  </div>
                 
                  {item.date && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground ml-7">
                      <Calendar className="h-4 w-4" />
                      <span>{item.date}</span>
                    </div>
                  )}
                   {item.responsible && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground ml-7">
                      <User className="h-4 w-4" />
                      <span>{item.responsible}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No timeline actions were identified.</p>
        )}
      </CardContent>
    </Card>
  );
}
