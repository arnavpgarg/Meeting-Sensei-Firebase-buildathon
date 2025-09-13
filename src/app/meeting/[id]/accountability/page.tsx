'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
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
import { Skeleton } from '@/components/ui/skeleton';
import type { Analysis } from '@/lib/types';


type Task = ExtractTeamTasksOutput['tasks'][0];

type GroupedTasks = {
  [key: string]: Task[];
};

export default function NewAccountabilityPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<GroupedTasks>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    if (id) {
      const fetchTasks = async () => {
        try {
          const docRef = doc(db, 'meetings', id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const analysis = docSnap.data() as Analysis;
            if (analysis.teamTasks && analysis.teamTasks.tasks) {
              const fetchedTasks = analysis.teamTasks.tasks;
              setTasks(fetchedTasks);

              const grouped = fetchedTasks.reduce(
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
          } else {
            setError('Meeting not found.');
          }
        } catch (err) {
          console.error(err);
          setError('Failed to fetch tasks.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchTasks();
    }
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="flex items-center mb-6">
        <Button asChild variant="ghost" size="icon">
          <Link href={`/meeting/${id}`}>
            <ArrowLeft />
          </Link>
        </Button>
        <h1 className="font-headline text-3xl font-bold ml-2">Team Accountability</h1>
      </div>
      
      {isLoading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      ) : error ? (
         <Card>
          <CardContent className="pt-6">
            <p className="text-center text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : tasks.length === 0 ? (
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
