'use client';

import { useState } from 'react';
import type { Analysis } from '@/lib/types';
import { analyzeTranscript } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { TranscriptInput } from '@/components/transcript-input';
import { AnalysisView } from '@/components/analysis-view';
import { AnalysisSkeleton } from '@/components/analysis-skeleton';

const sampleTranscript = `Project "Phoenix" Weekly Sync - Meeting Transcript

Date: October 26, 2023

Attendees:
- Sarah (Project Manager)
- David (Lead Developer)
- Maria (UX/UI Designer)
- Tom (QA Engineer)

---

Sarah: "Alright everyone, let's kick off the weekly sync for Project Phoenix. David, can you start us off with the development update?"

David: "Sure. We've successfully integrated the new payment gateway API. It took a bit longer than expected due to some documentation gaps, but it's fully functional in the staging environment. We've also resolved the critical bug related to user session timeouts. However, we're slightly behind on the real-time notification feature. I estimate we're about three days behind schedule on that."

Sarah: "Okay, thanks for the update. Three days... we can probably absorb that. Maria, how are things on the design front?"

Maria: "Things are moving well. I've completed the final mockups for the user dashboard, incorporating the feedback from the last review. They're ready for handoff. I also have some initial wireframes for the new analytics page, but I'm concerned about the data visualization components. We might need a more powerful charting library than we initially planned for."

Sarah: "That's a valid concern. Let's make a decision on that. The current library is free, but limited. A premium one like 'SuperCharts' would cost around $2000 per year but would give us all the functionality we need and save significant development time."

David: "I agree. Building those complex charts from scratch with our current library would be a nightmare and push the timeline back at least two weeks. The $2000 is well worth it."

Sarah: "Okay, it's settled then. We're approved to purchase the 'SuperCharts' license. Maria, please coordinate with David on the integration. Tom, what do you have from QA?"

Tom: "Staging looks mostly stable. I've logged a few minor UI bugs related to the new payment flow, but nothing blocking. My main concern is the lack of test coverage for the session timeout fix. I'll need David to help write some more specific unit tests for that."

David: "Understood. I'll block out time for that tomorrow morning."

Sarah: "Great. So, to recap: David will work on the unit tests and then get back on the notification feature. Maria will hand off the dashboard designs and start integrating the new charting library with David. Tom will continue regression testing. I'll handle the purchase order for the license. Anything else? No? Okay, great meeting everyone. Let's connect next week."`;

export function Dashboard() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState(sampleTranscript);
  const { toast } = useToast();

  const handleReset = () => {
    setAnalysis(null);
  };

  const handleAnalyze = async (currentTranscript: string) => {
    if (isLoading) return;
    setIsLoading(true);
    setAnalysis(null);

    const { data, error } = await analyzeTranscript(currentTranscript);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: error,
      });
    }

    if (data) {
      setAnalysis(data);
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      {isLoading ? (
        <AnalysisSkeleton />
      ) : analysis ? (
        <AnalysisView analysis={analysis} onReset={handleReset} />
      ) : (
        <TranscriptInput
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          transcript={transcript}
          setTranscript={setTranscript}
        />
      )}
    </div>
  );
}
