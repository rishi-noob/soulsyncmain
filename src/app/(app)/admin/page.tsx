
"use client";

import { BarChart, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Line, Bar, CartesianGrid } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockAdminStats } from '@/lib/data';
import { ChartConfig, ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

const moodChartConfig = {
  mood: {
    label: 'Avg. Mood (1-5)',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const usageChartConfig = {
  usage: {
    label: 'Chatbot Interactions',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

const forumChartConfig = {
    posts: {
        label: 'Forum Posts',
        color: 'hsl(var(--chart-1))',
    }
} satisfies ChartConfig;

export default function AdminPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Management Dashboard</h1>
                <p className="text-muted-foreground">Aggregated and anonymized platform analytics.</p>
            </div>
            <Button>
                <Download className="mr-2 h-4 w-4"/>
                Export Reports (CSV)
            </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
                <CardHeader>
                    <CardTitle>Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">1,254</p>
                    <p className="text-sm text-muted-foreground">+201 since last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Active Users (Monthly)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">982</p>
                    <p className="text-sm text-muted-foreground">+15% from last month</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Bookings (via Google Form)</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">78</p>
                    <p className="text-sm text-muted-foreground">+5 this week</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
            <Card>
            <CardHeader>
                <CardTitle>Monthly Mood Trends</CardTitle>
                <CardDescription>Average user mood rating (1-5 scale).</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
            </Card>

            <Card>
            <CardHeader>
                <CardTitle>Chatbot Usage</CardTitle>
                <CardDescription>Total AI chatbot interactions per month.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={usageChartConfig} className="h-[250px] w-full">
                    <LineChart data={mockAdminStats.chatbotUsage}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="usage" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Forum Activity</CardTitle>
                <CardDescription>Total number of posts in the peer-to-peer forum.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={forumChartConfig} className="h-[300px] w-full">
                    <BarChart data={mockAdminStats.forumActivity}>
                        <CartesianGrid vertical={false} />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
                        <YAxis />
                        <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Legend />
                        <Bar dataKey="posts" fill="hsl(var(--chart-1))" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
