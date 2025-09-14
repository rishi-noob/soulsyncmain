
"use client";

import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, Flag, MessageSquare } from "lucide-react";
import Link from "next/link";
import { BarChart, LineChart, XAxis, YAxis, Tooltip, Legend, Line, Bar, CartesianGrid } from 'recharts';
import { mockAdminStats } from '@/lib/data';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const moodChartConfig = {
  mood: {
    label: 'Avg. Mood (1-5)',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const forumChartConfig = {
    posts: {
        label: 'Forum Posts',
        color: 'hsl(var(--chart-2))',
    }
} satisfies ChartConfig;


export default function VolunteerPage() {
    const { user } = useAuth();

    if (!user) {
        return (
            <div className="container mx-auto p-8 text-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Volunteer Dashboard</h1>
                        <p className="text-muted-foreground">Tools and insights to support the community.</p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Active Threads</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">12</p>
                            <p className="text-sm text-muted-foreground">Discussions happening right now.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Flagged Posts</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">3</p>
                            <p className="text-sm text-muted-foreground">Posts needing review.</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Resource Contributions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">5</p>
                            <p className="text-sm text-muted-foreground">Your submitted resources.</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Jump right into your volunteer activities.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-3 gap-4">
                        <Button asChild size="lg" variant="outline">
                            <Link href="/forum">
                                <MessageSquare className="mr-2"/>
                                Moderate Forum
                            </Link>
                        </Button>
                         <Button asChild size="lg" variant="outline">
                            <Link href="/admin/moderation">
                                <Flag className="mr-2"/>
                                Review Flagged Content
                            </Link>
                        </Button>
                         <Button asChild size="lg" variant="outline">
                            <Link href="/resources">
                                <FilePlus className="mr-2"/>
                                Add a Resource
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Student Engagement Analytics</CardTitle>
                        <CardDescription>Anonymized trends in community wellness.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid lg:grid-cols-2 gap-8">
                         <div className="flex flex-col gap-4">
                            <h3 className="font-semibold">Monthly Mood Trends</h3>
                            <ChartContainer config={moodChartConfig} className="h-[250px] w-full">
                                <LineChart data={mockAdminStats.moodTrends}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis domain={[1, 5]} />
                                    <Tooltip content={<ChartTooltipContent />} />
                                    <Legend />
                                    <Line type="monotone" dataKey="mood" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={false} />
                                </LineChart>
                            </ChartContainer>
                        </div>
                         <div className="flex flex-col gap-4">
                            <h3 className="font-semibold">Forum Activity</h3>
                            <ChartContainer config={forumChartConfig} className="h-[250px] w-full">
                                <BarChart data={mockAdminStats.forumActivity}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                                    <YAxis />
                                    <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                                    <Legend />
                                    <Bar dataKey="posts" fill="hsl(var(--chart-2))" radius={4} />
                                </BarChart>
                            </ChartContainer>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
