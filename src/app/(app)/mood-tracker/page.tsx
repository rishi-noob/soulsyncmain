"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockMoodData } from '@/lib/data';
import type { MoodEntry } from '@/lib/data';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { format, startOfWeek, addDays, getMonth, getYear } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

const questions = [
  { id: 'day', text: 'How was your day?', options: ['😃', '🙂', '😐', '😔', '😢'], values: [5, 4, 3, 2, 1]},
  { id: 'anxious', text: 'Did you feel anxious today?', options: ['No', 'Sometimes', 'Often'] },
  { id: 'sleep', text: 'Did you sleep well last night?', options: ['Yes', 'No'] },
  { id: 'angry', text: 'Did you feel angry at any time?', options: ['Yes', 'No'] },
  { id: 'motivated', text: 'How motivated were you?', options: ['High', 'Medium', 'Low'] },
];

export default function MoodTrackerPage() {
    const { toast } = useToast();
    const { user, updateUser } = useAuth();
    const [moodLog, setMoodLog] = useState<Record<string, string>>({});
    const [moodEntries, setMoodEntries] = useState<MoodEntry[]>(mockMoodData);

    const handleValueChange = (id: string, value: string) => {
        setMoodLog(prev => ({...prev, [id]: value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const dayRating = moodLog.day;
        if (!dayRating) {
             toast({
                variant: 'destructive',
                title: "Incomplete Log",
                description: "Please rate how your day was before submitting.",
            });
            return;
        }

        const intensityIndex = questions[0].options.indexOf(dayRating);
        const intensity = questions[0].values[intensityIndex];
        
        const todayDate = format(new Date(), 'yyyy-MM-dd');

        const newEntry: MoodEntry = {
            date: todayDate,
            intensity: intensity,
        };

        const existingEntryIndex = moodEntries.findIndex(e => e.date === newEntry.date);
        
        if (existingEntryIndex !== -1) {
            const updatedEntries = [...moodEntries];
            updatedEntries[existingEntryIndex] = newEntry;
            setMoodEntries(updatedEntries);
            toast({
                title: "Mood updated!",
                description: "Your mood for today has been updated.",
            });
        } else {
            setMoodEntries([...moodEntries, newEntry]);
            if (user) {
                updateUser({ streak: user.streak + 1 });
            }
            toast({
                title: "Mood logged successfully!",
                description: "Your mood for today has been recorded. Keep up the great work!",
            });
        }
    }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Daily Mood Log</CardTitle>
            <CardDescription>Take a moment to check in with yourself.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              {questions.map((q) => (
                <div key={q.id}>
                  <Label className="text-base">{q.text}</Label>
                  <RadioGroup onValueChange={(value) => handleValueChange(q.id, value)} value={moodLog[q.id]} className="mt-2 flex gap-4">
                    {q.options.map((opt) => (
                      <Label key={opt} htmlFor={`${q.id}-${opt}`} className="cursor-pointer rounded-lg border p-3 text-2xl has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-all">
                        <RadioGroupItem value={opt} id={`${q.id}-${opt}`} className="sr-only" />
                        {opt}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
              ))}
              <div>
                <Label htmlFor="triggers" className="text-base">Any triggers to record? (optional)</Label>
                <Textarea id="triggers" placeholder="e.g., exam pressure, social situation..." className="mt-2" />
              </div>
              <Button type="submit" className="w-full">Save Today's Entry</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Mood Calendar</CardTitle>
            <CardDescription>A heatmap of your mood intensity over the last 3 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <MoodHeatmap moodData={moodEntries} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MoodHeatmap({ moodData }: { moodData: MoodEntry[] }) {
    const today = new Date();
    const startDate = new Date();
    startDate.setDate(today.getDate() - 89); // approx 3 months
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const moodDataByDate = moodData.reduce((acc, entry) => {
        acc[entry.date] = entry.intensity;
        return acc;
    }, {} as Record<string, number>);

    const weeks = [];
    let currentDate = startOfWeek(startDate);
    let currentMonth = -1;

    for (let i = 0; i < 13; i++) { // 13 weeks
        const week = [];
        let monthLabel = null;
        for (let j = 0; j < 7; j++) {
            const dateStr = format(currentDate, 'yyyy-MM-dd');
            const intensity = moodDataByDate[dateStr] || 0;
            const month = getMonth(currentDate);

            if (month !== currentMonth && j === 0) {
              currentMonth = month;
              monthLabel = format(currentDate, 'MMM');
            }
            
            week.push({ date: dateStr, intensity, monthLabel });
            currentDate = addDays(currentDate, 1);
        }
        weeks.push(week);
    }

  const getBgColor = (intensity: number) => {
    if (intensity === 0) return 'bg-muted/50';
    const opacity = intensity / 5;
    return `bg-primary`; // Opacity handled by style
  };

  return (
    <TooltipProvider>
        <div className="flex gap-2 text-xs text-muted-foreground">
            <div className="w-8"></div>
            {weeks.map((week, i) => (
                <div key={i} className="w-[14px] text-center relative">
                    {week[0].monthLabel && <span className="absolute -top-4 left-1/2 -translate-x-1/2">{week[0].monthLabel}</span>}
                </div>
            ))}
        </div>
        <div className="flex gap-2">
            <div className="flex flex-col gap-[2px] w-8">
                {weekDays.map(day => <div key={day} className="h-[14px] text-xs text-muted-foreground text-right pr-1">{day}</div>)}
            </div>
            <div className="flex gap-[2px]">
            {weeks.map((week, i) => (
                <div key={i} className="flex flex-col gap-[2px]">
                {week.map((day) => (
                    <Tooltip key={day.date}>
                    <TooltipTrigger asChild>
                        <div
                        className={`w-[14px] h-[14px] rounded-sm ${getBgColor(day.intensity)}`}
                        style={{ opacity: day.intensity > 0 ? day.intensity / 5 : 1 }}
                        />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{day.intensity > 0 ? `${day.intensity}/5 mood` : 'No entry'} on {format(new Date(day.date), 'MMM d, yyyy')}</p>
                    </TooltipContent>
                    </Tooltip>
                ))}
                </div>
            ))}
            </div>
        </div>
        <div className="flex justify-end items-center gap-2 mt-2 text-xs text-muted-foreground">
            <span>Less</span>
            <div className="w-3 h-3 rounded-sm bg-muted/50"></div>
            <div className="w-3 h-3 rounded-sm bg-primary opacity-25"></div>
            <div className="w-3 h-3 rounded-sm bg-primary opacity-50"></div>
            <div className="w-3 h-3 rounded-sm bg-primary opacity-75"></div>
            <div className="w-3 h-3 rounded-sm bg-primary"></div>
            <span>More</span>
        </div>
    </TooltipProvider>
  );
}
