'use server';
/**
 * @fileOverview An AI agent for moderating forum messages.
 *
 * - automoderateForumMessage - A function that checks if a forum message is appropriate.
 * - AutomoderateForumMessageInput - The input type for the automoderateForumMessage function.
 * - AutomoderateForumMessageOutput - The return type for the automoderateForumMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomoderateForumMessageInputSchema = z.object({
  text: z.string().describe('The text content of the forum message.'),
});
export type AutomoderateForumMessageInput = z.infer<typeof AutomoderateForumMessageInputSchema>;

const AutomoderateForumMessageOutputSchema = z.object({
  allowed: z.boolean().describe('Whether the message is allowed.'),
  flagReason: z.string().optional().describe('The reason why the message was flagged, if applicable.'),
});
export type AutomoderateForumMessageOutput = z.infer<typeof AutomoderateForumMessageOutputSchema>;

export async function automoderateForumMessage(input: AutomoderateForumMessageInput): Promise<AutomoderateForumMessageOutput> {
  return automoderateForumMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automoderateForumMessagePrompt',
  input: {schema: AutomoderateForumMessageInputSchema},
  output: {schema: AutomoderateForumMessageOutputSchema},
  prompt: `You are a moderator for a peer-to-peer forum focused on student mental health.
  Your job is to determine if a given message is appropriate for the forum.
  If the message contains harmful, inappropriate, or offensive content, you should flag it.
  Otherwise, you should allow it.

  Message: {{{text}}}

  Respond with a JSON object that contains the following fields:
  - allowed: true if the message is allowed, false otherwise.
  - flagReason: If allowed is false, provide a brief reason why the message was flagged.
`,
});

const automoderateForumMessageFlow = ai.defineFlow(
  {
    name: 'automoderateForumMessageFlow',
    inputSchema: AutomoderateForumMessageInputSchema,
    outputSchema: AutomoderateForumMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
