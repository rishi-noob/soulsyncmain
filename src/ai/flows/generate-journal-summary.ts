'use server';
/**
 * @fileOverview An AI flow that analyzes journal entries and generates a visual summary.
 *
 * - generateJournalSummary - A function that creates a mind map summary from journal text.
 * - GenerateJournalSummaryInput - The input type for the function.
 * - GenerateJournalSummaryOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJournalSummaryInputSchema = z.object({
  journalContent: z.string().describe('The concatenated text from one or more journal entries.'),
});
export type GenerateJournalSummaryInput = z.infer<typeof GenerateJournalSummaryInputSchema>;

const SummaryThemeSchema = z.object({
    theme: z.string().describe("A primary theme or topic identified in the text (e.g., 'Academic Stress', 'Gratitude')."),
    keywords: z.array(z.string()).describe("A list of 2-4 keywords or concepts related to this theme."),
    sentiment: z.enum(['positive', 'negative', 'neutral']).describe("The overall sentiment of this theme."),
});

const GenerateJournalSummaryOutputSchema = z.object({
    centralIdea: z.string().describe("The single, most central idea or feeling from the journal entries. This will be the center of the mind map."),
    themes: z.array(SummaryThemeSchema).describe("A list of 2-4 major themes branching off the central idea."),
    actionableInsight: z.string().optional().describe("A brief, actionable insight or question for the user to reflect on."),
});
export type GenerateJournalSummaryOutput = z.infer<typeof GenerateJournalSummaryOutputSchema>;


export async function generateJournalSummary(input: GenerateJournalSummaryInput): Promise<GenerateJournalSummaryOutput> {
  return generateJournalSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateJournalSummaryPrompt',
  input: {schema: GenerateJournalSummaryInputSchema},
  output: {schema: GenerateJournalSummaryOutputSchema},
  prompt: `You are an insightful AI assistant that specializes in summarizing and visualizing personal journal entries into a mind map structure.
Your task is to analyze the provided journal content and extract key themes, sentiments, and a central idea.

**Journal Content:**
{{{journalContent}}}

**Your Goal:**
1.  Identify the most prominent, overarching idea or emotion. This will be the 'centralIdea' of the mind map.
2.  Extract 2-4 major 'themes' that branch from this central idea.
3.  For each theme, identify its overall 'sentiment' (positive, negative, or neutral) and a few related 'keywords'.
4.  Provide one 'actionableInsight'—a gentle question or suggestion for the user's reflection based on your analysis.

Structure your response as a single JSON object matching the output schema.
`,
});

const generateJournalSummaryFlow = ai.defineFlow(
  {
    name: 'generateJournalSummaryFlow',
    inputSchema: GenerateJournalSummaryInputSchema,
    outputSchema: GenerateJournalSummaryOutputSchema,
  },
  async (input, streamingCallback) => {
    let retries = 0;
    const maxRetries = 3;

    while (retries < maxRetries) {
      try {
        const {output} = await prompt(input);
        return output!;
      } catch (error: any) {
        if (error.message.includes('503 Service Unavailable') && retries < maxRetries - 1) {
          retries++;
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        } else {
          throw error;
        }
      }
    }
    throw new Error('Failed to generate journal summary after multiple retries.');
  }
);
