"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FilePlus, Flag, MessageSquare, Newspaper } from "lucide-react";
import Link from "next/link";

export default function VolunteerPage() {
    const { user, role } = useAuth();
    const router = useRouter();

    if (role !== "volunteer") {
        router.push('/dashboard');
        return (
            <div className="container mx-auto p-8 text-center">
                <p>Redirecting...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="container mx-auto p-8 text-center">
                <h1 className="text-2xl font-bold">Access Denied</h1>
                <p className="text-muted-foreground">You must be logged in to view this page.</p>
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
                            <Link href="#">
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
                    <CardContent>
                        <p className="text-muted-foreground">Charts and summaries about student engagement and mood trends would be displayed here for volunteers to see community-level insights without compromising individual privacy.</p>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
