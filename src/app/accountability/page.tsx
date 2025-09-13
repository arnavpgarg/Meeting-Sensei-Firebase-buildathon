'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Calendar, CheckSquare } from 'lucide-react';
import type { ExtractTeamTasksOutput } from '@/ai/flows/extract-team-tasks';

type Task = ExtractTeamTasksOutput['tasks'][0];

type GroupedTasks = {
  [key: string]: Task[];
};

export default function AccountabilityPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<GroupedTasks>({});

  useEffect(() => {
    const storedAnalysis = localStorage.getItem('meetingAnalysis');
    if (storedAnalysis) {
      const analysis = JSON.parse(storedAnalysis);
      if (analysis.teamTasks && analysis.teamTasks.tasks) {
        setTasks(analysis.teamTasks.tasks);

        const grouped = analysis.teamTasks.tasks.reduce(
          (acc: GroupedTasks, task: Task) => {
            const assignee = task.assignee || 'Unassigned';
            if (!acc[assignee]) {
              acc[assignee] = [];
            }
            acc[assignee].push(task);
            return acc;
          },
          {}
        );
        setGroupedTasks(grouped);
      }
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center mb-6">
        <Button asChild variant="ghost" size="icon">
          <Link href="/">
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold ml-2">Team Accountability</h1>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No tasks were assigned in this meeting.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Assigned Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Assignee
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4" />
                      Task
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Deadline
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(groupedTasks).map(([assignee, tasks]) =>
                  tasks.map((task, index) => (
                    <TableRow key={`${assignee}-${index}`}>
                      {index === 0 && (
                        <TableCell
                          rowSpan={tasks.length}
                          className="font-medium align-top"
                        >
                          {assignee}
                        </TableCell>
                      )}
                      <TableCell>{task.task}</TableCell>
                      <TableCell>{task.deadline || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
