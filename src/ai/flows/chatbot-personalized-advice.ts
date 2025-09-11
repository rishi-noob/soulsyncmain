'use server';

/**
 * @fileOverview A Genkit flow that generates personalized advice for students based on their mood data and academic deadlines.
 *
 * - generatePersonalizedAdvice - A function that generates personalized advice for a student.
 * - GeneratePersonalizedAdviceInput - The input type for the generatePersonalizedAdvice function.
 * - GeneratePersonalizedAdviceOutput - The return type for the generatePersonalizedAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedAdviceInputSchema = z.object({
  moodData: z.string().describe('The recent mood data of the student.'),
  academicDeadlines: z.string().describe('The upcoming academic deadlines of the student.'),
  chatHistory: z.string().describe('The recent chat history of the student with the chatbot.'),
});
export type GeneratePersonalizedAdviceInput = z.infer<typeof GeneratePersonalizedAdviceInputSchema>;

const GeneratePersonalizedAdviceOutputSchema = z.object({
  message_html: z.string().describe('The HTML formatted message to display to the user.'),
  coping_steps: z.array(z.string()).describe('An array of suggested coping steps.'),
  escalation: z
    .enum(['none', 'recommend_counsellor', 'urgent_hotline'])
    .describe('The escalation level.'),
  confidence_score: z.number().min(0).max(1).describe('The confidence score of the response.'),
  source_references: z.array(z.string()).describe('An array of source references.'),
});
export type GeneratePersonalizedAdviceOutput = z.infer<typeof GeneratePersonalizedAdviceOutputSchema>;

export async function generatePersonalizedAdvice(
  input: GeneratePersonalizedAdviceInput
): Promise<GeneratePersonalizedAdviceOutput> {
  return generatePersonalizedAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatbotPersonalizedAdvicePrompt',
  input: {schema: GeneratePersonalizedAdviceInputSchema},
  output: {schema: GeneratePersonalizedAdviceOutputSchema},
  prompt: `You are a mental health support chatbot for students. Use the student's mood data, academic deadlines, and chat history to provide personalized advice and coping strategies.

Mood Data: {{{moodData}}}
Academic Deadlines: {{{academicDeadlines}}}
Chat History: {{{chatHistory}}}

Format your response as a JSON object with the following fields:
- message_html: The HTML formatted message to display to the user.
- coping_steps: An array of suggested coping steps.
- escalation: The escalation level (none, recommend_counsellor, urgent_hotline).
- confidence_score: The confidence score of the response (0-1).
- source_references: An array of source references.{
  "message_html": "string",
  "coping_steps": ["string"],
  "escalation": "none | recommend_counsellor | urgent_hotline",
  "confidence_score": 0.0,
  "source_references": ["string"]
}

Remember to always include this disclaimer in the message_html: "This is a supportive aid, not a substitute for professional diagnosis."`,
});

const generatePersonalizedAdviceFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedAdviceFlow',
    inputSchema: GeneratePersonalizedAdviceInputSchema,
    outputSchema: GeneratePersonalizedAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
