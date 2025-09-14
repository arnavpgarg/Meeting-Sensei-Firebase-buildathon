'use client';

import { Suspense } from 'react';
import { redirect, useSearchParams } from 'next/navigation';
import { AnalysisSkeleton } from '@/components/analysis-skeleton';

function RedirectToHome() {
  const searchParams = useSearchParams();
  const data = searchParams.get('data');

  if (!data) {
    // If no data, redirect to homepage, maybe show a toast?
    // For now, simple redirect.
    if (typeof window !== 'undefined') {
       redirect('/');
    }
  }
  return <AnalysisSkeleton />;
}

export default function OldAccountabilityPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <Suspense fallback={<AnalysisSkeleton />}>
        <RedirectToHome />
      </Suspense>
    </div>
  );
}