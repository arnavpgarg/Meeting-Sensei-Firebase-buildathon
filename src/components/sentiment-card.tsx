'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

type Sentiment = 'positive' | 'negative' | 'neutral';

type SentimentCardProps = {
  sentiment: Sentiment;
  reason: string;
};

const sentimentConfig: Record<
  Sentiment,
  { colorClass: string; value: number; label: string }
> = {
  positive: {
    colorClass: 'bg-green-500',
    value: 100,
    label: 'Positive',
  },
  neutral: {
    colorClass: 'bg-yellow-500',
    value: 50,
    label: 'Neutral',
  },
  negative: {
    colorClass: 'bg-red-500',
    value: 10,
    label: 'Negative',
  },
};

export function SentimentCard({ sentiment, reason }: SentimentCardProps) {
  const config = sentimentConfig[sentiment] || sentimentConfig.neutral;

  return (
    <Card className="h-full print-break-inside-avoid">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Sentiment Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-2xl font-semibold">{config.label}</p>
        </div>
        <Progress value={config.value} className="h-3 [&>div]:bg-[var(--sentiment-color)]" style={{'--sentiment-color': `var(--${config.label.toLowerCase()})`} as React.CSSProperties} />
        <CardDescription>{reason}</CardDescription>
      </CardContent>
    </Card>
  );
}
