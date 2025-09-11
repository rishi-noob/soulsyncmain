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
  moodData: z.string().describe('The recent mood data of the student (e.g., "On 2024-01-01, mood was 3/5; On 2024-01-02, mood was 2/5").'),
  academicDeadlines: z.string().describe('The upcoming academic deadlines of the student.'),
  chatHistory: z.string().describe('The recent chat history of the student with the chatbot. The last message is the user\'s most recent query.'),
});
export type GeneratePersonalizedAdviceInput = z.infer<typeof GeneratePersonalizedAdviceInputSchema>;

const GeneratePersonalizedAdviceOutputSchema = z.object({
  message_html: z.string().describe('The HTML formatted message to display to the user. This should be a warm, encouraging, and actionable message based on the user\'s input. It MUST include the disclaimer.'),
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
Your primary goal is to provide helpful, non-judgmental, and actionable advice by directly responding to the user's most recent message.

You will be given the following context about a student:
- Recent mood data: A summary of their mood scores (out of 5).
- Upcoming academic deadlines: A list of their assignments and exams.
- Recent chat history: The conversation history. The last message is the user's current question or statement.

**Context:**
- Mood Data: {{{moodData}}}
- Academic Deadlines: {{{academicDeadlines}}}
- Chat History: {{{chatHistory}}}

**Your Task:**
1.  **Prioritize the last message in the Chat History.** Your main goal is to respond directly to what the user just said.
2.  Use the Mood Data and Academic Deadlines as background context to make your response more personal and insightful, but do not simply list their deadlines back to them. For example, if they say "I'm feeling stressed" and you see they have an exam soon, you can acknowledge the exam as a likely source of stress.
3.  Craft a warm, encouraging, and supportive message in HTML format that directly answers the user's query or responds to their statement.
4.  If appropriate, provide actionable, simple, and concrete next steps or coping strategies related to their message.
5.  If the student expresses persistent or significant distress, recommend they see a counsellor.
6.  ONLY if the student expresses thoughts of self-harm, suicide, or being a danger to others, include a hotline number and strongly recommend they call.
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
