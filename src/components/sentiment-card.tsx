import { Smile, Meh, Frown, Icon } from 'lucide-react';
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
  { Icon: Icon; color: string; value: number; label: string }
> = {
  positive: {
    Icon: Smile,
    color: 'text-green-500',
    value: 100,
    label: 'Positive',
  },
  neutral: {
    Icon: Meh,
    color: 'text-yellow-500',
    value: 50,
    label: 'Neutral',
  },
  negative: {
    Icon: Frown,
    color: 'text-red-500',
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
        <div className="flex items-center gap-3">
          <config.Icon className={`h-8 w-8 ${config.color}`} />
          <p className="text-2xl font-semibold">{config.label}</p>
        </div>
        <Progress value={config.value} className="h-3" />
        <CardDescription>{reason}</CardDescription>
      </CardContent>
    </Card>
  );
}
