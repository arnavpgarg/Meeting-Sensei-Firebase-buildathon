'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useMemo } from 'react';
import {
  eachDayOfInterval,
  format,
  parseISO,
  differenceInDays,
  addDays,
} from 'date-fns';
import type { GenerateActionTimelineOutput } from '@/ai/flows/generate-action-timeline';

type GanttChartProps = {
  data: GenerateActionTimelineOutput['timeline'];
};

type ProcessedData = {
  name: string;
  range: [number, number];
  responsible?: string;
  tooltip: string;
}[];

export function GanttChart({ data }: GanttChartProps) {
  const { processedData, allDates } = useMemo(() => {
    if (!data || data.length === 0) {
      return { processedData: [], allDates: [] };
    }

    const today = new Date();
    let minDate = today;
    let maxDate = addDays(today, 1); // Ensure at least one day is shown

    // First pass to determine date range
    data.forEach((item) => {
      const startDate = item.startDate ? parseISO(item.startDate) : today;
      let endDate;
      if (item.endDate) {
        endDate = parseISO(item.endDate);
      } else if (item.duration) {
        endDate = addDays(startDate, item.duration);
      } else {
        endDate = addDays(startDate, 1);
      }

      if (startDate < minDate) minDate = startDate;
      if (endDate > maxDate) maxDate = endDate;
    });

    const allDates = eachDayOfInterval({ start: minDate, end: maxDate });

    const processedData: ProcessedData = data
      .map((item, index) => {
        const startDate = item.startDate ? parseISO(item.startDate) : today;
        let endDate;
        if (item.endDate) {
          endDate = parseISO(item.endDate);
        } else if (item.duration) {
          endDate = addDays(startDate, item.duration - 1);
        } else {
          endDate = startDate;
        }

        const startDay = differenceInDays(startDate, minDate);
        const endDay = differenceInDays(endDate, minDate);

        return {
          name: item.action,
          range: [startDay, endDay + 1],
          responsible: item.responsible,
          tooltip: `${item.action}${
            item.responsible ? ` (${item.responsible})` : ''
          }: ${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d')}`,
        };
      })
      .reverse(); // reverse to show first task at the top

    return { processedData, allDates };
  }, [data]);

  if (processedData.length === 0) {
    return <p>No data to display in chart.</p>;
  }

  const yAxisWidth = Math.max(...processedData.map((d) => d.name.length)) * 6 + 20;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={processedData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: yAxisWidth - 80, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          domain={[0, allDates.length]}
          ticks={allDates
            .map((date, index) => (index % 5 === 0 ? index : null))
            .filter((i) => i !== null) as number[]}
          tickFormatter={(tick) => format(allDates[tick], 'MMM d')}
        />
        <YAxis
          dataKey="name"
          type="category"
          width={yAxisWidth}
          tick={{
            fontSize: 12,
            width: yAxisWidth,
            textAnchor: 'start',
            dx: -yAxisWidth + 10,
          }}
          interval={0}
        />
        <Tooltip
          content={({ payload }) => {
            if (payload && payload.length > 0) {
              return (
                <div className="bg-background border p-2 rounded shadow-lg">
                  <p className="text-sm text-foreground">
                    {payload[0].payload.tooltip}
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="range" fill="var(--color-chart-1)">
          {processedData.map((entry, index) => (
            <Bar
              key={`bar-${index}`}
              dataKey="range"
              fill="var(--color-chart-1)"
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
