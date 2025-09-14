
"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Flag, Trash2, ShieldQuestion } from "lucide-react";

// Mock data for flagged content
const flaggedContent = [
    { id: 'flag-1', threadId: 'thread-2', messageId: 'msg-x', authorHash: 'Student_3c4d', text: 'This is a test of some potentially borderline content.', reason: 'Potential Harassment', date: '2 hours ago' },
    { id: 'flag-2', threadId: 'thread-1', messageId: 'msg-y', authorHash: 'Student_1a2b', text: 'I really disagree with you and I think you are wrong.', reason: 'AI Flag - Rudeness', date: '1 day ago' },
    { id: 'flag-3', threadId: 'thread-5', messageId: 'msg-z', authorHash: 'Student_New1', text: 'This looks like spam: mynewwebsite.com', reason: 'Spam', date: '3 days ago' },
];

export default function ModerationPage() {
    const { user } = useAuth();
    
    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Content Moderation</h1>
                    <p className="text-muted-foreground">Review and take action on content flagged by users or the AI moderator.</p>
                </div>
                
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <ShieldQuestion />
                           Flagged for Review
                        </CardTitle>
                        <CardDescription>
                            The following posts have been flagged and require manual review.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Author</TableHead>
                                    <TableHead>Content</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {flaggedContent.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.authorHash}</TableCell>
                                        <TableCell className="max-w-sm truncate text-muted-foreground">"{item.text}"</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{item.reason}</Badge>
                                        </TableCell>
                                        <TableCell>{item.date}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-600">
                                                <CheckCircle className="h-4 w-4 mr-1"/> Approve
                                            </Button>
                                             <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4 mr-1"/> Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
