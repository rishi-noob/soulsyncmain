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
          // Wait for a short period before retrying (e.g., 1 second)
          await new Promise(resolve => setTimeout(resolve, 1000 * retries));
        } else {
          // If it's not a 503 error or retries are exhausted, throw the error
          throw error;
        }
      }
    }

    // This part should not be reached if retries are handled correctly,
    // but returning a default or throwing an error is a good practice.
    throw new Error('Failed to moderate forum message after multiple retries.');
  }
);
