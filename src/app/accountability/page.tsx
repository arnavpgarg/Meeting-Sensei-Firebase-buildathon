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

// This page is now a catch-all route to handle both legacy and new routes.
// We are keeping the old page to avoid breaking changes for existing users.
export default function AccountabilityPage() {
  return null;
}
