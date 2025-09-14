'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import type { Analysis } from '@/lib/types';
import { AnalysisView } from '@/components/analysis-view';
import { AnalysisSkeleton } from '@/components/analysis-skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function MeetingDetailsPage() {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      const fetchMeeting = async () => {
        try {
          const docRef = doc(db, 'meetings', id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setAnalysis(docSnap.data() as Analysis);
          } else {
            setError('No such meeting found.');
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch meeting details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchMeeting();
    }
  }, [id]);
  
  const handleReset = () => {
    router.push('/');
  }

  if (isLoading) {
    return (
       <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
        <AnalysisSkeleton />
       </div>
    )
  }
  
  if (error) {
     return (
       <div className="container mx-auto flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <p className="text-destructive text-lg">{error}</p>
           <Button asChild>
             <Link href="/">Go to Homepage</Link>
           </Button>
       </div>
     )
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <AnalysisView analysis={analysis} onReset={handleReset} meetingId={id} />
    </div>
  );
}