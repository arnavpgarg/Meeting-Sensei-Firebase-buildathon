import Link from 'next/link';
import { BrainCircuit, History } from 'lucide-react';
import { Button } from './ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b bg-background/95 backdrop-blur-sm no-print">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <BrainCircuit className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-foreground">
            Meeting Sensei
          </h1>
        </Link>
        <Button asChild variant="outline">
          <Link href="/history">
            <History className="mr-2" />
            History
          </Link>
        </Button>
      </div>
    </header>
  );
}