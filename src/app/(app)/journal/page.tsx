"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookMarked, PlusCircle } from 'lucide-react';
import { mockJournalEntries } from '@/lib/data';
import type { JournalEntry } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const templates = {
    'gratitude': "What are 5 things you're grateful for today?\n1. \n2. \n3. \n4. \n5. ",
    'proud_list': "What are 5 things you're proud of accomplishing?\n1. \n2. \n3. \n4. \n5. ",
    'free_form': "",
};

export default function JournalPage() {
    const [entries, setEntries] = useState<JournalEntry[]>(mockJournalEntries);
    const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('free_form');
    const [editorContent, setEditorContent] = useState('');

    const handleTemplateChange = (value: string) => {
        const key = value as keyof typeof templates;
        setSelectedTemplate(key);
        setEditorContent(templates[key]);
    }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Private Journal</h1>
                <p className="text-muted-foreground">A safe space for your thoughts and reflections.</p>
            </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>New Entry</CardTitle>
                        <div className="flex items-center gap-4 pt-2">
                            <span className="text-sm font-medium">Use a template:</span>
                            <Select onValueChange={handleTemplateChange} defaultValue="free_form">
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a template" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="free_form">Free Form</SelectItem>
                                    <SelectItem value="gratitude">Gratitude List</SelectItem>
                                    <SelectItem value="proud_list">Proud List</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent>
                         <Textarea 
                            placeholder="Start writing..." 
                            className="min-h-[300px]"
                            value={editorContent}
                            onChange={(e) => setEditorContent(e.target.value)}
                        />
                         <div className="flex justify-end mt-4">
                            <Button>Save Entry</Button>
                         </div>
                    </CardContent>
                </Card>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <BookMarked className="h-5 w-5"/>
                        Past Entries
                    </CardTitle>
                    <CardDescription>Review your previous thoughts.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {entries.map((entry, index) => (
                        <div key={entry.id}>
                           <div className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                                <p className="font-semibold capitalize">{entry.formatType.replace('_', ' ')}</p>
                                <p className="text-sm text-muted-foreground truncate">{entry.content}</p>
                                <p className="text-xs text-muted-foreground mt-1">{entry.date}</p>
                           </div>
                           {index < entries.length - 1 && <Separator />}
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
