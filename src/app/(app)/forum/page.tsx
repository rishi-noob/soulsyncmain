"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockThreads } from "@/lib/data";
import type { Thread } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, PlusCircle } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/auth-context";

export default function ForumPage() {
    const { user } = useAuth();
    const [threads, setThreads] = useState<Thread[]>(mockThreads);
    const [newThreadTitle, setNewThreadTitle] = useState("");
    const [newThreadContent, setNewThreadContent] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreateThread = () => {
        if (!newThreadTitle.trim() || !newThreadContent.trim() || !user) return;

        const newThread: Thread = {
            id: `thread-${Date.now()}`,
            title: newThreadTitle,
            authorHash: `User_${user.id.substring(0,4)}`,
            createdAt: "Just now",
            messageCount: 1,
            isClosed: false,
        };

        setThreads([newThread, ...threads]);
        setNewThreadTitle("");
        setNewThreadContent("");
        setIsDialogOpen(false);
    }

  return (
    <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Community Forum</h1>
                <p className="text-muted-foreground">Connect with peers, share experiences, and find support.</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        New Thread
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Start a New Discussion</DialogTitle>
                        <DialogDescription>
                            Share what's on your mind. Please be respectful and supportive of others.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input id="title" value={newThreadTitle} onChange={(e) => setNewThreadTitle(e.target.value)} className="col-span-3" placeholder="A descriptive title for your thread" />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label htmlFor="content" className="text-right mt-2">Content</Label>
                            <Textarea id="content" value={newThreadContent} onChange={(e) => setNewThreadContent(e.target.value)} className="col-span-3 min-h-[120px]" placeholder="Write the first message of your thread..."/>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleCreateThread}>Post Thread</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>

      <Card>
        <CardHeader>
          <CardTitle>Threads</CardTitle>
          <CardDescription>Browse ongoing discussions or start a new one.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="text-right">Replies</TableHead>
                <TableHead className="hidden sm:table-cell text-right">Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {threads.map((thread) => (
                <TableRow key={thread.id}>
                  <TableCell>
                    <Link href={`/forum/${thread.id}`} className="font-medium hover:underline">
                        {thread.title}
                    </Link>
                    {thread.isClosed && <Badge variant="outline" className="ml-2">Closed</Badge>}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{thread.authorHash}</TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-1">
                      <MessageSquare className="h-3 w-3 text-muted-foreground"/>
                      {thread.messageCount}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-right text-muted-foreground">{thread.createdAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
