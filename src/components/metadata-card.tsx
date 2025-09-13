import {
  KanbanSquare,
  Phone,
  Users,
  Landmark,
  MoreHorizontal,
  Icon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type MetadataCardProps = {
  category: string;
};

const categoryIcons: Record<string, Icon> = {
  'project update': KanbanSquare,
  'client call': Phone,
  'hiring discussion': Users,
  budgeting: Landmark,
  other: MoreHorizontal,
};

export function MetadataCard({ category }: MetadataCardProps) {
  const CategoryIcon = categoryIcons[category] || MoreHorizontal;
  return (
    <Card className="h-full print-break-inside-avoid">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3">
          <CategoryIcon className="h-8 w-8 text-accent" />
          <p className="text-2xl font-semibold capitalize">{category}</p>
        </div>
      </CardContent>
    </Card>
  );
}
