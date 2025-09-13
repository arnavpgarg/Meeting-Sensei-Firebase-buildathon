import { CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SummaryCardProps = {
  summary: string;
};

export function SummaryCard({ summary }: SummaryCardProps) {
  // Split summary into bullet points. Handles both '*' and '-' as list markers.
  const points = summary.split(/[\n*•-]/).filter((p) => p.trim() !== '');

  return (
    <Card className="print-break-inside-avoid">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {points.map((point, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <span>{point.trim()}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
