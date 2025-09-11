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
  chatHistory: z.string().describe('The recent chat history of the student with the chatbot.'),
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
Your primary goal is to provide helpful, non-judgmental, and actionable advice. Your responses should feel personal and directly related to the user's situation, not generic.

You will be given the following information about a student:
- Recent mood data: A summary of their mood scores (out of 5).
- Upcoming academic deadlines: A list of their assignments and exams.
- Recent chat history: The last few messages in your conversation.

Use this context to generate a personalized response. Analyze the provided information to understand the student's current emotional state and stressors.

**Student Information:**
- Mood Data: {{{moodData}}}
- Academic Deadlines: {{{academicDeadlines}}}
- Chat History: {{{chatHistory}}}

**Your Task:**
1.  Analyze the provided information to understand the student's current emotional state and stressors.
2.  Craft a warm and encouraging message in HTML format. Address the student's specific concerns from the chat history, and connect them to their mood data and deadlines if relevant. For example, if they mention feeling stressed and you see they have a low mood score and an exam coming up, acknowledge that connection.
3.  Provide actionable, simple, and concrete next steps or coping strategies.
4.  If the student expresses persistent or significant distress that warrants professional help, recommend they see a counsellor.
5.  ONLY if the student expresses thoughts of self-harm, suicide, or being a danger to others, include a hotline number and strongly recommend they call.
6.  **Crucially, you MUST ALWAYS include the following disclaimer at the end of your "message_html"**: "<p><i><br>Disclaimer: I am an AI assistant. This is supportive aid, not a substitute for professional diagnosis.</i></p>"

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
