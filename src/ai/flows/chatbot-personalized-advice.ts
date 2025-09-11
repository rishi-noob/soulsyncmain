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
3.  If the student expresses persistent or significant distress that warrants professional help, recommend they see a counsellor.
4.  ONLY if the student expresses thoughts of self-harm, suicide, or being a danger to others, include a hotline number and strongly recommend they call.
5.  **Crucially, you MUST ALWAYS include the following disclaimer at the end of your "message_html"**: "<p><i><br>Disclaimer: I am an AI assistant. This is supportive aid, not a substitute for professional diagnosis.</i></p>"

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
