'use server';

/**
 * @fileOverview Generates personalized wellness reminders based on upcoming academic events and user mood data.
 *
 * - generateWellnessReminders - A function that generates wellness reminders.
 * - GenerateWellnessRemindersInput - The input type for the generateWellnessReminders function.
 * - GenerateWellnessRemindersOutput - The return type for the generateWellnessReminders function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateWellnessRemindersInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  upcomingEvents: z.array(
    z.object({
      title: z.string().describe('The title of the academic event.'),
      date: z.string().describe('The date of the academic event (ISO format).'),
      type: z.string().describe('The type of the academic event (e.g., exam, assignment).'),
      notes: z.string().optional().describe('Any notes associated with the event.'),
    })
  ).describe('A list of upcoming academic events for the user.'),
  moodEntries: z.array(
    z.object({
      date: z.string().describe('The date of the mood entry (ISO format).'),
      responses: z.record(z.string(), z.any()).describe('The mood entry responses.'),
    })
  ).describe('A list of recent mood entries for the user.'),
});

export type GenerateWellnessRemindersInput = z.infer<typeof GenerateWellnessRemindersInputSchema>;

const GenerateWellnessRemindersOutputSchema = z.object({
  reminders: z.array(
    z.string().describe('A list of personalized wellness reminders.')
  ).describe('Generated wellness reminders based on user data.'),
});

export type GenerateWellnessRemindersOutput = z.infer<typeof GenerateWellnessRemindersOutputSchema>;

export async function generateWellnessReminders(input: GenerateWellnessRemindersInput): Promise<GenerateWellnessRemindersOutput> {
  return generateWellnessRemindersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWellnessRemindersPrompt',
  input: {schema: GenerateWellnessRemindersInputSchema},
  output: {schema: GenerateWellnessRemindersOutputSchema},
  prompt: `You are a wellness assistant that provides personalized wellness reminders to students based on their upcoming academic events and mood data.

  Upcoming Events:
  {{#each upcomingEvents}}
  - {{title}} on {{date}} ({{type}}): {{notes}}
  {{/each}}

  Recent Mood Data:
  {{#each moodEntries}}
  - {{date}}: {{responses}}
  {{/each}}

  Generate a list of wellness reminders tailored to the student's situation. Focus on providing practical tips and strategies for managing stress and promoting well-being during stressful periods related to their academic events. Be concise and supportive.

  Reminders:
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const generateWellnessRemindersFlow = ai.defineFlow(
  {
    name: 'generateWellnessRemindersFlow',
    inputSchema: GenerateWellnessRemindersInputSchema,
    outputSchema: GenerateWellnessRemindersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
