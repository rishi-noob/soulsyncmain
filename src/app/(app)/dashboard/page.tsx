"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Flame, HeartPulse, MessageSquare, Sparkles, Wind, BookOpen, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { mockAcademicEvents } from "@/lib/data";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="container mx-auto p-4 md:p-8">
          <div className="relative isolate">
                <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                    <div
                        style={{
                            clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)'
                        }}
                        className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#8085ff] to-[#5438dc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    />
                </div>
                <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-headline">Your Campus Mental Health Companion</h1>
                        <p className="mt-6 text-lg leading-8 text-gray-300">Confidential • Supportive • Always Available</p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <Button asChild size="lg">
                                <Link href="/chatbot">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Start Chat
                                </Link>
                            </Button>
                            <Button asChild variant="secondary" size="lg">
                                <a href="https://forms.gle/your-booking-form" target="_blank" rel="noopener noreferrer">
                                    Book a Session
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
      </div>
    )
  }

  const upcomingEvents = mockAcademicEvents.slice(0, 2);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome back, {user.name.split(' ')[0]}!</h1>
                <p className="text-muted-foreground">Here’s your wellness snapshot for today.</p>
            </div>
            <div className="flex gap-2">
                 <Button asChild variant="outline">
                    <Link href="/mood-tracker">
                        <HeartPulse className="mr-2 h-4 w-4"/> Log Mood
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/focus-tool">
                        <Wind className="mr-2 h-4 w-4"/> Start Focus Session
                    </Link>
                </Button>
            </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mood Streak</CardTitle>
              <Flame className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.streak} days</div>
              <p className="text-xs text-muted-foreground">
                Keep it up! Consistency is key.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Focus Points</CardTitle>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.focusPoints}</div>
              <p className="text-xs text-muted-foreground">
                Total trees planted: {user.treesPlanted}
              </p>
            </CardContent>
          </Card>
          <Card className="hover:bg-muted/50 transition-colors" asChild>
            <Link href="/forum">
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Community</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">Connect & Share</div>
                 <p className="text-xs text-muted-foreground">
                    Join the conversation in the peer forum.
                </p>
            </CardContent>
            </Link>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5"/>
                        Upcoming Deadlines
                    </CardTitle>
                    <CardDescription>Stay on top of your academic schedule.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-4">
                        {upcomingEvents.map(event => (
                            <li key={event.id} className="flex items-center space-x-4">
                               <div className="flex-shrink-0 bg-secondary text-secondary-foreground rounded-lg w-12 h-12 flex flex-col items-center justify-center">
                                    <span className="text-xs uppercase">{format(event.date, 'MMM')}</span>
                                    <span className="text-lg font-bold">{format(event.date, 'd')}</span>
                               </div>
                               <div>
                                    <h3 className="font-semibold">{event.title}</h3>
                                    <p className="text-sm text-muted-foreground capitalize">{event.type}</p>
                               </div>
                               <Button asChild variant="ghost" size="sm" className="ml-auto">
                                   <Link href="/calendar">View</Link>
                               </Button>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
            <Card className="bg-primary/10 border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-primary">
                        <BrainCircuit className="h-5 w-5"/>
                        First-Aid Chatbot
                    </CardTitle>
                    <CardDescription>Personalized advice just for you.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center">
                     <Avatar className="w-16 h-16 mb-4">
                        <AvatarImage src="https://picsum.photos/seed/ai-bot/100/100" />
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-foreground/80 mb-4">Feeling overwhelmed by your upcoming {upcomingEvents[0].type}? Let's break it down together. Chat with me for personalized strategies.</p>
                    <Button asChild>
                        <Link href="/chatbot">Chat Now</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
