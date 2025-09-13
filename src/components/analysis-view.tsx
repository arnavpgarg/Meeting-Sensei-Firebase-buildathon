'use client';

import type { Analysis } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  FileDown,
  FileText,
  Redo,
  Share2,
  Users,
  BarChart2,
} from 'lucide-react';
import { SummaryCard } from './summary-card';
import { KeyDecisionsCard } from './key-decisions-card';
import { MetadataCard } from './metadata-card';
import { SentimentCard } from './sentiment-card';
import { TimelineCard } from './timeline-card';
import { useEffect } from 'react';

type AnalysisViewProps = {
  analysis: Analysis;
  onReset: () => void;
  meetingId?: string;
};

export function AnalysisView({ analysis, onReset, meetingId }: AnalysisViewProps) {

  const handleExportTxt = () => {
    const { category, sentiment, summary, keyDecisions, timeline, teamTasks } =
      analysis;
    const decisionsText = keyDecisions.decisions
      .map(
        (d) =>
          `  - Decision: ${d.decision}\n    - Reason: ${d.reason}\n    - Action Items: ${d.actionItems.join(
            ', '
          )}`
      )
      .join('\n\n');

    const tasksText =
      teamTasks?.tasks
        .map(
          (t) =>
            `  - Assignee: ${t.assignee}\n    - Task: ${t.task}\n    - Deadline: ${
              t.deadline || 'N/A'
            }`
        )
        .join('\n\n') || 'No tasks assigned.';

    const content = `MEETING SENSEI ANALYSIS
=========================

CATEGORY
--------
${category.category}

SENTIMENT
---------
${sentiment.sentiment} - ${sentiment.reason}

SUMMARY
-------
${summary.summary}

KEY DECISIONS
-------------
${decisionsText}

ACTION TIMELINE
---------------
${timeline.ganttChartMarkdown}

TEAM ACCOUNTABILITY
-------------------
${tasksText}
`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
a.href = url;
    a.download = 'meeting-analysis.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 no-print">
        <h2 className="font-headline text-3xl font-bold">Analysis Results</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={onReset}>
            <Redo className="mr-2" />
            New Analysis
          </Button>
          <Button asChild variant="outline" disabled={!meetingId}>
            <Link href={`/meeting/${meetingId}/accountability`}>
              <Users className="mr-2" />
              Accountability
            </Link>
          </Button>
          <Button asChild variant="outline" disabled={!meetingId}>
            <Link href={`/meeting/${meetingId}/timeline`}>
              <BarChart2 className="mr-2" />
              Actions Chart
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Share2 className="mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportTxt}>
                <FileText className="mr-2" />
                Export as TXT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPdf}>
                <FileDown className="mr-2" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="printable-area">
        <div className="grid grid-cols-1 md:col-cols-2 lg:grid-cols-4 gap-6">
          <div className="md:col-span-1 lg:col-span-2">
            <MetadataCard category={analysis.category.category} />
          </div>
          <div className="md:col-span-1 lg:col-span-2">
            <SentimentCard
              sentiment={analysis.sentiment.sentiment}
              reason={analysis.sentiment.reason}
            />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <SummaryCard summary={analysis.summary.summary} />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <KeyDecisionsCard decisions={analysis.keyDecisions.decisions} />
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <TimelineCard timeline={analysis.timeline.ganttChartMarkdown} />
          </div>
        </div>
      </div>
    </div>
  );
}
