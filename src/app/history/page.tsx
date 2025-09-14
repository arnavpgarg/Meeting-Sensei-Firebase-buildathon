'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
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
import { Eye, Calendar, Tag, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

type Meeting = {
  id: string;
  category: { category: string };
  summary: { summary: string };
  createdAt: { toDate: () => Date };
};

export default function HistoryPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const meetingsRef = collection(db, 'meetings');
        const q = query(meetingsRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const meetingsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Meeting[];
        setMeetings(meetingsData);
      } catch (error) {
        console.error("Error fetching meetings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <h1 className="font-headline text-3xl font-bold mb-6">Meeting History</h1>
      <Card>
        <CardHeader>
          <CardTitle>Past Analyses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category
                  </div>
                </TableHead>
                <TableHead>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Summary
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                  </TableRow>
                ))
              ) : meetings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    No meeting history found.
                  </TableCell>
                </TableRow>
              ) : (
                meetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell>
                      {meeting.createdAt
                        ? format(meeting.createdAt.toDate(), 'PPP p')
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="capitalize">
                      {meeting.category.category}
                    </TableCell>
                    <TableCell className="max-w-sm truncate">
                      {meeting.summary.summary}
                    </TableCell>
                    <TableCell>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/meeting/${meeting.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}