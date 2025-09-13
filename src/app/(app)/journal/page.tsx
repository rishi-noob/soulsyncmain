"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookMarked, PlusCircle, Sparkles, Brain, Tags, Smile, Frown, Meh, Lightbulb } from 'lucide-react';
import { mockJournalEntries } from '@/lib/data';
import type { JournalEntry } from '@/lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { generateJournalSummary, GenerateJournalSummaryOutput } from '@/ai/flows/generate-journal-summary';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const templates = {
    'gratitude': "What are 5 things you're grateful for today?\n1. \n2. \n3. \n4. \n5. ",
    'proud_list': "What are 5 things you're proud of accomplishing?\n1. \n2. \n3. \n4. \n5. ",
    'free_form': "",
};

const sentimentIcons: Record<string, React.ReactNode> = {
    positive: <Smile className="h-4 w-4 text-green-500" />,
    negative: <Frown className="h-4 w-4 text-red-500" />,
    neutral: <Meh className="h-4 w-4 text-yellow-500" />,
}

export default function JournalPage() {
    const { toast } = useToast();
    const [entries, setEntries] = useState<JournalEntry[]>(mockJournalEntries);
    const [selectedTemplate, setSelectedTemplate] = useState<keyof typeof templates>('free_form');
    const [editorContent, setEditorContent] = useState('');
    const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
    const [checkedEntries, setCheckedEntries] = useState<Set<string>>(new Set());
    const [isVisualizing, setIsVisualizing] = useState(false);
    const [summary, setSummary] = useState<GenerateJournalSummaryOutput | null>(null);

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
                entry.id === selectedEntry.id ? { ...entry, content: editorContent, formatType: selectedEntry.formatType } : entry
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

    const handleCheckEntry = (entryId: string) => {
        setCheckedEntries(prev => {
            const newSet = new Set(prev);
            if (newSet.has(entryId)) {
                newSet.delete(entryId);
            } else {
                newSet.add(entryId);
            }
            return newSet;
        });
    }

    const handleVisualize = async () => {
        if (checkedEntries.size === 0) {
            toast({
                variant: 'destructive',
                title: "No Entries Selected",
                description: "Please select at least one journal entry to visualize.",
            });
            return;
        }

        setIsVisualizing(true);
        setSummary(null);

        const contentToSummarize = entries
            .filter(entry => checkedEntries.has(entry.id))
            .map(entry => `[Entry from ${entry.date}]:\n${entry.content}`)
            .join("\n\n---\n\n");
        
        try {
            const result = await generateJournalSummary({ journalContent: contentToSummarize });
            setSummary(result);
        } catch (error) {
            console.error("Failed to generate summary:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not generate AI visualization. Please try again.",
            });
        } finally {
            setIsVisualizing(false);
        }
    }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Private Journal</h1>
            <p className="text-muted-foreground">A safe space for your thoughts and reflections.</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>{selectedEntry ? `Editing Entry from ${selectedEntry.date}` : "New Entry"}</CardTitle>
                             <Button onClick={handleNewEntry} variant="outline" size="sm">
                                <PlusCircle className="mr-2 h-4 w-4"/> New
                            </Button>
                        </div>
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
                            className="min-h-[250px]"
                            value={editorContent}
                            onChange={(e) => setEditorContent(e.target.value)}
                        />
                         <div className="flex justify-end mt-4">
                            <Button onClick={handleSaveEntry}>{selectedEntry ? 'Update Entry' : 'Save Entry'}</Button>
                         </div>
                    </CardContent>
                </Card>

                 {summary && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Sparkles className="h-5 w-5" />
                                Journal Mind Map
                            </CardTitle>
                            <CardDescription>A visual summary of your selected entries.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-center p-4 rounded-lg bg-primary/10">
                                <h3 className="text-sm font-semibold text-primary-foreground/80 uppercase tracking-wider">Central Idea</h3>
                                <p className="text-2xl font-bold font-headline flex items-center justify-center gap-2"><Brain className="h-6 w-6" /> {summary.centralIdea}</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                {summary.themes?.map((theme, index) => (
                                    <div key={index} className="p-4 rounded-lg bg-muted/50 space-y-2">
                                        <h4 className="font-semibold flex items-center gap-2">{sentimentIcons[theme.sentiment]} {theme.theme}</h4>
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <Tags className="h-4 w-4 text-muted-foreground" />
                                            {theme.keywords.map(keyword => (
                                                <Badge key={keyword} variant="secondary">{keyword}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {summary.actionableInsight && (
                                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 text-accent-foreground flex items-start gap-3">
                                    <Lightbulb className="h-5 w-5 mt-1 text-accent" />
                                    <div>
                                        <h4 className="font-semibold">Actionable Insight</h4>
                                        <p className="text-sm text-accent-foreground/80">{summary.actionableInsight}</p>
                                    </div>
                                </div>
                            )}

                        </CardContent>
                    </Card>
                )}

            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                        <BookMarked className="h-5 w-5"/>
                        Past Entries
                    </CardTitle>
                    <CardDescription>Select entries to visualize with AI.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                    {entries.length > 0 ? entries.map((entry) => (
                        <div key={entry.id} className="flex items-start gap-3 p-2 rounded-lg has-[:checked]:bg-muted">
                           <Checkbox
                                id={`check-${entry.id}`}
                                className="mt-1"
                                checked={checkedEntries.has(entry.id)}
                                onCheckedChange={() => handleCheckEntry(entry.id)}
                            />
                           <div 
                                className="flex-1 cursor-pointer"
                                onClick={() => handleSelectEntry(entry)}
                            >
                                <p className="font-semibold capitalize">{entry.formatType.replace('_', ' ')}</p>
                                <p className="text-sm text-muted-foreground truncate">{entry.content}</p>
                                <p className="text-xs text-muted-foreground mt-1">{entry.date}</p>
                           </div>
                        </div>
                    )) : (
                        <p className="text-sm text-muted-foreground text-center pt-8">No entries yet. Start writing!</p>
                    )}
                </CardContent>
                <CardFooter>
                     <Button className="w-full" onClick={handleVisualize} disabled={isVisualizing || checkedEntries.size === 0}>
                        {isVisualizing ? "Visualizing..." : <><Sparkles className="mr-2"/> Visualize with AI ({checkedEntries.size})</>}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    </div>
  )
}
