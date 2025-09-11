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
  coping_steps: z.array(z.string()).optional().describe('An array of suggested, actionable coping steps.'),
  escalation: z
    .enum(['none', 'recommend_counsellor', 'urgent_hotline'])
    .describe('The escalation level based on the severity of the user\'s situation.'),
  confidence_score: z.number().min(0).max(1).describe('The confidence score of the advice.'),
  source_references: z.array(z.string()).optional().describe('An array of source references, if any.'),
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
  prompt: `You are a friendly, empathetic, and supportive mental health chatbot for university students. Your name is SoulSync.
Your primary goal is to provide helpful, non-judgmental, and actionable advice.

You will be given the following information about a student:
- Recent mood data
- Upcoming academic deadlines
- Recent chat history

Use this context to generate a personalized response.

**Student Information:**
- Mood Data: {{{moodData}}}
- Academic Deadlines: {{{academicDeadlines}}}
- Chat History: {{{chatHistory}}}

**Your Task:**
1.  Analyze the provided information to understand the student's current emotional state and stressors.
2.  Craft a warm and encouraging message in HTML format. Address the student's specific concerns.
3.  If applicable, provide a short, actionable list of 2-3 "coping_steps" that the student can take right now (e.g., "Try a 5-minute breathing exercise," "Write down your thoughts," "Schedule a short walk").
4.  Assess the "escalation" level.
    - 'none': For general stress, anxiety, or low mood.
    - 'recommend_counsellor': If the student expresses persistent or significant distress that warrants professional help.
    - 'urgent_hotline': ONLY if the student expresses thoughts of self-harm, suicide, or being a danger to others.
5.  Provide a "confidence_score" for your response.
6.  If you use external knowledge, cite your "source_references". Otherwise, provide an empty array.
7.  **Crucially, you MUST ALWAYS include the following disclaimer at the end of your "message_html"**: "<p><i><br>Disclaimer: I am an AI assistant. This is supportive aid, not a substitute for professional diagnosis.</i></p>"

Your entire response must be a single JSON object matching the output schema.
`,
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
