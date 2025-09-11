"use client";

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, TreePine } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Icons } from '@/components/icons';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

const TIMES: Record<TimerMode, number> = {
  pomodoro: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

export default function FocusToolPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [time, setTime] = useState(TIMES[mode]);
  const [isActive, setIsActive] = useState(false);
  const [pomodoros, setPomodoros] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  const handleModeChange = useCallback((newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    setTime(TIMES[newMode]);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      if(mode === 'pomodoro') {
        setPomodoros(p => p + 1);
        toast({
            title: "Pomodoro Complete!",
            description: `You've earned a focus point! Time for a short break.`,
        });
        // In a real app, you would save the focus point to the user's profile
        if (pomodoros > 0 && (pomodoros + 1) % 4 === 0) {
          handleModeChange('longBreak');
        } else {
          handleModeChange('shortBreak');
        }
      } else {
         toast({ title: "Break's over!", description: "Time to get back to it." });
         handleModeChange('pomodoro');
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, mode, pomodoros, handleModeChange, toast]);


  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTime(TIMES[mode]);
  };
  
  const progress = ((TIMES[mode] - time) / TIMES[mode]) * 100;

  return (
    <div className="container mx-auto p-4 md:p-8">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Focus Tool</h1>
            <p className="text-muted-foreground">Cultivate focus, one session at a time.</p>
        </div>
        
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
                <CardTitle>Pomodoro Timer</CardTitle>
                {isAuthenticated && user && (
                    <div className="flex gap-2 items-center text-sm">
                        <span className="font-semibold">{user.focusPoints + pomodoros} Focus Points</span>
                        <span className="text-muted-foreground">|</span>
                        <span className="flex items-center gap-1"><TreePine className="h-4 w-4 text-primary" />{user.treesPlanted} Trees</span>
                    </div>
                )}
            </div>
            <div className="flex gap-2 pt-4">
              {(['pomodoro', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => (
                <Button
                  key={m}
                  variant={mode === m ? 'default' : 'outline'}
                  onClick={() => handleModeChange(m)}
                >
                  {m === 'pomodoro' && 'Pomodoro'}
                  {m === 'shortBreak' && 'Short Break'}
                  {m === 'longBreak' && 'Long Break'}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-6">
            <div className="text-8xl font-bold font-mono" aria-live="polite">
              {formatTime(time)}
            </div>
            <div className="w-full">
                <Progress value={progress} />
            </div>
            <div className="flex gap-4">
              <Button onClick={toggleTimer} size="lg" className="w-32">
                {isActive ? <Pause className="mr-2 h-5 w-5"/> : <Play className="mr-2 h-5 w-5"/>}
                {isActive ? 'Pause' : 'Start'}
              </Button>
              <Button onClick={resetTimer} variant="secondary" size="lg">
                <RotateCcw className="mr-2 h-5 w-5"/>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center">
            <CardHeader>
                <CardTitle>Grow Your Focus Plant</CardTitle>
                <CardDescription>Complete a session to help your plant grow.</CardDescription>
            </CardHeader>
          <CardContent>
            <Icons.plant progress={progress/100} className="w-64 h-64 text-primary" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
