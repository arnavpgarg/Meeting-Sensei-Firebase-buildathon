'use client';

import {Suspense, useEffect, useState} from 'react';
import {useSearchParams} from 'next/navigation';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {User, Calendar, CheckSquare} from 'lucide-react';
import type {ExtractTeamTasksOutput} from '@/ai/flows/extract-team-tasks';
import {AnalysisSkeleton} from '@/components/analysis-skeleton';
import {Header} from '@/components/header';

type Task = ExtractTeamTasksOutput['tasks'][0];

type GroupedTasks = {
  [key: string]: Task[];
};

function AccountabilityContent() {
  const searchParams = useSearchParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<GroupedTasks>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const teamTasks: ExtractTeamTasksOutput = JSON.parse(
          decodeURIComponent(data)
        );
        if (teamTasks.tasks) {
          setTasks(teamTasks.tasks);
          const grouped = teamTasks.tasks.reduce(
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
      } catch (error) {
        console.error('Failed to parse tasks data:', error);
      }
    }
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return <AnalysisSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <h1 className="font-headline text-3xl font-bold mb-6">
        Team Accountability
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Assigned Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {tasks.length > 0 ? (
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
          ) : (
            <div className="text-center text-muted-foreground py-8">
              No tasks were assigned in this meeting.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function AccountabilityPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<AnalysisSkeleton />}>
        <AccountabilityContent />
      </Suspense>
    </>
  );
}
