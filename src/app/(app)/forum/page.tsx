import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockThreads } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, PlusCircle } from "lucide-react";
import Link from "next/link";

export default function ForumPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Community Forum</h1>
                <p className="text-muted-foreground">Connect with peers, share experiences, and find support.</p>
            </div>
            <Button>
                <PlusCircle className="mr-2 h-4 w-4"/>
                New Thread
            </Button>
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
              {mockThreads.map((thread) => (
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
