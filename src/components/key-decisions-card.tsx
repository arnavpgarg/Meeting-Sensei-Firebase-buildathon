'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Lightbulb, Target } from 'lucide-react';
import type { ExtractKeyDecisionsOutput } from '@/ai/flows/extract-key-decisions';

type KeyDecisionsCardProps = {
  decisions: ExtractKeyDecisionsOutput['decisions'];
};

export function KeyDecisionsCard({ decisions }: KeyDecisionsCardProps) {
  const [showReasons, setShowReasons] = useState(true);
  const [showActionItems, setShowActionItems] = useState(true);

  return (
    <Card className="print-break-inside-avoid">
      <CardHeader>
        <CardTitle className="font-headline text-lg">Key Decisions</CardTitle>
        <div className="flex items-center space-x-4 pt-2 no-print">
          <div className="flex items-center space-x-2">
            <Switch
              id="show-reasons"
              checked={showReasons}
              onCheckedChange={setShowReasons}
            />
            <Label htmlFor="show-reasons">Show Reasons</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="show-actions"
              checked={showActionItems}
              onCheckedChange={setShowActionItems}
            />
            <Label htmlFor="show-actions">Show Action Items</Label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {decisions.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {decisions.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left hover:no-underline">
                  {item.decision}
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  {showReasons && (
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Reason</h4>
                        <p className="text-muted-foreground">{item.reason}</p>
                      </div>
                    </div>
                  )}
                  {showActionItems && item.actionItems.length > 0 && (
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold">Action Items</h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.actionItems.map((action, i) => (
                            <Badge key={i} variant="secondary">
                              {action}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-muted-foreground">No key decisions were identified.</p>
        )}
      </CardContent>
    </Card>
  );
}
