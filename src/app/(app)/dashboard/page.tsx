
"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, Flame, Wind, BookCopy, Users, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { mockThreads } from "@/lib/data";
import Image from "next/image";

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    // This should be handled by AuthGuard, but as a fallback:
    return (
       <div className="container mx-auto p-8 text-center">
            <h1 className="text-2xl font-bold">Please log in</h1>
            <p className="text-muted-foreground">You need to be logged in to view the dashboard.</p>
            <Button asChild className="mt-4"><Link href="/login">Sign In</Link></Button>
       </div>
    );
  }

  const latestThread = mockThreads[0];

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">Hello, {user.name.split(' ')[0]}!</h1>
                <p className="text-muted-foreground">Ready to start your day with a clear mind?</p>
            </div>
            <div className="flex gap-2">
                 <Button asChild variant="outline">
                    <Link href="/mood-tracker">
                        <HeartPulse className="mr-2 h-4 w-4"/> Log Today's Mood
                    </Link>
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
                <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 p-8 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold font-headline text-primary-foreground">Feeling Overwhelmed?</h2>
                        <p className="text-primary-foreground/80 mt-2 mb-4">Let's break it down together. Chat with our AI assistant for personalized strategies to navigate your day.</p>
                        <Button asChild>
                            <Link href="/chatbot">
                                <Sparkles className="mr-2"/>
                                Chat with AI Assistant
                            </Link>
                        </Button>
                    </div>
                    <Image src="/hero-icon.svg" alt="Wellness" width={120} height={120} data-ai-hint="abstract illustration" />
                </Card>

                <div className="grid md:grid-cols-2 gap-6">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Wind />
                                Focus Zone
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <p className="text-muted-foreground mb-4">Start a focus session to boost your productivity.</p>
                              <div className="flex items-center gap-4">
                                <div className="text-4xl font-bold">{user.focusPoints}</div>
                                <div>
                                    <p className="font-semibold">Focus Points</p>
                                    <p className="text-xs text-muted-foreground">Trees planted: {user.treesPlanted}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Flame />
                                Mood Streak
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">Log your mood daily to build a healthy habit.</p>
                             <div className="flex items-center gap-4">
                                <div className="text-4xl font-bold">{user.streak}</div>
                                <div>
                                    <p className="font-semibold">Day Streak</p>
                                    <p className="text-xs text-muted-foreground">Keep it going!</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookCopy />
                            Your Journal
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">A private space for your thoughts. Ready to reflect?</p>
                        <Button asChild variant="secondary" className="w-full">
                            <Link href="/journal">Open Journal</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users />
                            Community Forum
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground text-sm mb-3">Latest conversation:</p>
                        <Link href={`/forum/${latestThread.id}`} className="block p-3 rounded-md bg-muted/50 hover:bg-muted transition-colors">
                            <p className="font-semibold truncate">{latestThread.title}</p>
                            <p className="text-xs text-muted-foreground">{latestThread.messageCount} replies</p>
                        </Link>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <ShieldCheck />
                           Book a Session
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">Schedule a confidential session with a professional.</p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/booking">See Availability</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      </div>
    </div>
  );
}
