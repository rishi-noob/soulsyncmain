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
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

const templates = {
    'gratitude': "What are 5 things you're grateful for today?\n1. \n2. \n3. \n4. \n5. ",
    'proud_list': "What are 5 things you're proud of accomplishing?\n1. \n2. \n3. \n4. \n5. ",
    'free_form': "",
};

export default function JournalPage() {
    const { toast } = useToast();
    const [entries, setEntries] = useState<JournalEntry[]>(mockJournalEntries);
    const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('free_form');
    const [editorContent, setEditorContent] = useState('');
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

    const handleTemplateChange = (value: string) => {
        const key = value as keyof typeof templates;
        setSelectedTemplate(key);
        setEditorContent(templates[key]);
        setSelectedEntry(null);
    }

    const handleSaveEntry = () => {
        if (!editorContent.trim()) {
            toast({
                variant: 'destructive',
                title: "Can't save empty entry",
                description: "Please write something before saving.",
            });
            return;
        }

        if (selectedEntry) {
            // Update existing entry
            const updatedEntries = entries.map(entry => 
                entry.id === selectedEntry.id ? { ...entry, content: editorContent, formatType: selectedTemplate } : entry
            );
            setEntries(updatedEntries);
            toast({
                title: "Journal Entry Updated",
                description: "Your thoughts have been updated.",
            });

        } else {
            // Create new entry
            const newEntry: JournalEntry = {
                id: `journal-${Date.now()}`,
                date: format(new Date(), "PPP"),
                formatType: selectedTemplate,
                content: editorContent,
            };

            setEntries([newEntry, ...entries]);
            toast({
                title: "Journal Entry Saved",
                description: "Your thoughts have been recorded.",
            });
        }
        
        setEditorContent("");
        setSelectedTemplate("free_form");
        setSelectedEntry(null);
    }

    const handleSelectEntry = (entry: JournalEntry) => {
        setSelectedEntry(entry);
        setEditorContent(entry.content);
        setSelectedTemplate(entry.formatType);
    };

    const handleNewEntry = () => {
        setSelectedEntry(null);
        setEditorContent("");
        setSelectedTemplate("free_form");
    }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Private Journal</h1>
                <p className="text-muted-foreground">A safe space for your thoughts and reflections.</p>
            </div>
            <Button onClick={handleNewEntry}>
                <PlusCircle className="mr-2 h-4 w-4"/> New Entry
            </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{selectedEntry ? `Editing Entry from ${selectedEntry.date}` : "New Entry"}</CardTitle>
                        <div className="flex items-center gap-4 pt-2">
                            <span className="text-sm font-medium">Use a template:</span>
                            <Select onValueChange={handleTemplateChange} value={selectedTemplate} disabled={!!selectedEntry}>
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
                            <Button onClick={handleSaveEntry}>{selectedEntry ? 'Update Entry' : 'Save Entry'}</Button>
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
                    {entries.length > 0 ? entries.map((entry, index) => (
                        <div key={entry.id}>
                           <div 
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${selectedEntry?.id === entry.id ? 'bg-muted' : 'hover:bg-muted/50'}`}
                                onClick={() => handleSelectEntry(entry)}
                            >
                                <p className="font-semibold capitalize">{entry.formatType.replace('_', ' ')}</p>
                                <p className="text-sm text-muted-foreground truncate">{entry.content}</p>
                                <p className="text-xs text-muted-foreground mt-1">{entry.date}</p>
                           </div>
                           {index < entries.length - 1 && <Separator />}
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground text-center pt-8">No entries yet. Start writing!</p>
                    )}
                </CardContent>
            </Card>
        </div>
    </div>
  )
}
