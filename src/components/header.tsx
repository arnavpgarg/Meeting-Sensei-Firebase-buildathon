import { BrainCircuit } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur-sm no-print">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            Meeting Sensei
          </h1>
        </div>
      </div>
    </header>
  );
}
