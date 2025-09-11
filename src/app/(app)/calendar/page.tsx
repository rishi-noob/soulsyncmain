"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Sparkles, AlertTriangle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { mockAcademicEvents } from "@/lib/data";
import type { AcademicEvent } from "@/lib/data";
import { format } from "date-fns";
import { generateWellnessReminders } from "@/ai/flows/generate-wellness-reminders";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";

export default function CalendarPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<AcademicEvent[]>(mockAcademicEvents);
  const [reminders, setReminders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedDayEvents = events.filter(
    (event) => date && format(event.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );

  const handleGenerateReminders = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
        // In a real app, you would fetch real mood entries
        const mockMoodEntries = [{ date: new Date().toISOString(), responses: { mood: "stressed" } }];
        const upcomingEventsForAI = events
            .filter(event => event.date > new Date())
            .map(event => ({
                ...event,
                date: event.date.toISOString(),
            }));

        const result = await generateWellnessReminders({
            userId: user.id,
            upcomingEvents: upcomingEventsForAI,
            moodEntries: mockMoodEntries
        });
        
        // Let's add some mock reminders if AI returns empty
        if (result.reminders && result.reminders.length > 0) {
            setReminders(result.reminders);
        } else {
            setReminders([
                "Feeling the pressure? Try a 5-minute breathing exercise before your next study session.",
                "Remember to stay hydrated! Keep a water bottle handy while you study for your Psychology Midterm.",
                "Schedule a short walk after working on your History Essay to clear your head."
            ]);
        }
    } catch (error) {
        console.error("Failed to generate reminders:", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not generate wellness reminders.",
        });
        // Mock reminders on failure for better UX
        setReminders([
            "Take a 10-minute break every hour to stretch and rest your eyes.",
            "Make sure you get at least 7-8 hours of sleep, especially before an exam.",
            "Connect with a friend or family member for a quick chat to de-stress."
        ]);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
       <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Academic Calendar</h1>
                <p className="text-muted-foreground">Manage your deadlines and well-being.</p>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4"/>
                Add Event
            </Button>
        </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-8">
            <Card>
                <CardContent className="p-2 md:p-6 flex justify-center">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md"
                    modifiers={{
                        hasEvent: events.map(event => event.date)
                    }}
                    modifiersClassNames={{
                        hasEvent: 'bg-primary/20 text-primary-foreground rounded-full'
                    }}
                />
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Events for {date ? format(date, "PPP") : "Today"}</CardTitle>
                </CardHeader>
                <CardContent>
                {selectedDayEvents.length > 0 ? (
                    <ul className="space-y-4">
                    {selectedDayEvents.map((event) => (
                        <li key={event.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div>
                            <p className="font-semibold">{event.title}</p>
                            <Badge variant="outline" className="capitalize mt-1">{event.type}</Badge>
                        </div>
                        <Button variant="ghost" size="sm">Edit</Button>
                        </li>
                    ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground text-center py-4">No events for this day. Enjoy your break!</p>
                )}
                </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
            <Card className="bg-primary/10 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                <Sparkles className="h-5 w-5" />
                Personalized Wellness Reminders
                </CardTitle>
            </CardHeader>
            <CardContent>
                {reminders.length > 0 ? (
                    <ul className="space-y-3">
                        {reminders.map((reminder, index) => (
                            <li key={index} className="flex items-start gap-3 text-sm">
                                <span className="text-primary mt-1">&#8226;</span>
                                <span>{reminder}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground mb-4">
                        Generate AI-powered tips based on your upcoming events and recent mood.
                    </p>
                )}
                 <Button onClick={handleGenerateReminders} disabled={isLoading} className="w-full mt-4">
                    {isLoading ? "Generating..." : "Generate Reminders"}
                </Button>
            </CardContent>
            </Card>
             <Card className="bg-accent/10 border-accent/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-accent-foreground">
                        <AlertTriangle className="h-5 w-5 text-accent"/>
                        Need Support?
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <p className="text-sm text-muted-foreground mb-4">
                        If you're feeling overwhelmed, our AI chatbot is here to help you with coping strategies.
                    </p>
                    <Button variant="outline" className="w-full" asChild>
                        <a href="/chatbot">Talk to Chatbot</a>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
