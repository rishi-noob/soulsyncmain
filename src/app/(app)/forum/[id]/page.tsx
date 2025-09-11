"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, UserRole } from "@/context/auth-context";
import { mockMessages, mockThreads } from "@/lib/data";
import { Flag, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import type { Message } from "@/lib/data";

export default function ThreadPage({ params }: { params: { id: string } }) {
  const { user, role } = useAuth();
  const thread = mockThreads.find((t) => t.id === params.id);
  const [messages, setMessages] = useState<Message[]>(mockMessages.filter((m) => m.threadId === params.id));
  const [newReply, setNewReply] = useState("");

  if (!thread) {
    return (
      <div className="container mx-auto p-8 text-center">
        <h1 className="text-2xl font-bold">Thread not found</h1>
        <p className="text-muted-foreground">The discussion you're looking for doesn't exist.</p>
        <Button asChild variant="link" className="mt-4">
            <Link href="/forum">Back to Forum</Link>
        </Button>
      </div>
    );
  }

  const handlePostReply = () => {
    if (!newReply.trim() || !user) return;

    const reply: Message = {
        id: `msg-${Date.now()}`,
        threadId: params.id,
        authorHash: `User_${user.id.substring(0,4)}`,
        authorAvatar: user.avatarUrl,
        authorRole: user.role,
        text: newReply,
        createdAt: "Just now",
    };

    setMessages([...messages, reply]);
    setNewReply("");
  };

  const roleColors: Record<UserRole, string> = {
    student: 'text-muted-foreground',
    volunteer: 'text-primary',
    counsellor: 'text-accent-foreground',
    admin: 'text-destructive',
    management: 'text-destructive'
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">{thread.title}</h1>
        <p className="text-muted-foreground">
          Started by <span className="font-semibold">{thread.authorHash}</span> on {thread.createdAt}
        </p>
      </div>

      <div className="space-y-6">
        {messages.map((message) => (
          <Card key={message.id} className="p-4">
            <div className="flex gap-4">
              <Avatar>
                <AvatarImage src={message.authorAvatar} />
                <AvatarFallback>{message.authorHash.substring(0, 1)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold">{message.authorHash}</span>
                    <Badge variant="secondary" className={`ml-2 capitalize ${roleColors[message.authorRole]}`}>
                      {message.authorRole}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{message.createdAt}</span>
                </div>
                <p className="mt-2 text-sm">{message.text}</p>
                 <div className="flex items-center gap-2 mt-3">
                    {role === 'volunteer' && (
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                            <Trash2 className="h-4 w-4 mr-1"/> Delete
                        </Button>
                    )}
                    <Button variant="ghost" size="sm">
                        <Flag className="h-4 w-4 mr-1"/> Flag
                    </Button>
                 </div>
              </div>
            </div>
          </Card>
        ))}

        <Card>
            <CardContent className="p-4">
                <div className="flex items-start gap-4">
                     <Avatar>
                        <AvatarImage src={user?.avatarUrl} />
                        <AvatarFallback>Me</AvatarFallback>
                    </Avatar>
                    <div className="w-full space-y-2">
                        <Textarea 
                            placeholder="Write your reply..."
                            value={newReply}
                            onChange={(e) => setNewReply(e.target.value)}
                        />
                        <div className="flex justify-end">
                            <Button onClick={handlePostReply} disabled={!newReply.trim()}><Send className="h-4 w-4 mr-2"/> Post Reply</Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
