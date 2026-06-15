'use server';
/**
 * @fileOverview A server-side flow for generating a professional cover letter aligned with a job description.
 */

import { ai } from '@/ai/ai-instance';
import {
  CoverLetterInputSchema,
  CoverLetterOutputSchema,
  type CoverLetterInput,
  type CoverLetterOutput,
} from './generate-cover-letter.types';

/**
 * A server action that generates a specialist-positioned cover letter.
 */
export async function generateCoverLetter(
  input: CoverLetterInput
): Promise<CoverLetterOutput> {
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    throw new Error('The GOOGLE_GENAI_API_KEY environment variable is not set.');
  }
  return await coverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'coverLetterPrompt',
  input: { schema: CoverLetterInputSchema },
  output: { schema: CoverLetterOutputSchema },
  prompt: `You are an expert career consultant and professional writer. Your task is to write a highly persuasive, specialist-positioned cover letter for {{userProfile.name}}.

CONTEXT:
User Profile:
- Summary: {{{userProfile.summary}}}
- Title: {{userProfile.title}}
- Key Skills: {{#each userProfile.skills}}{{{this}}}, {{/each}}
- Recent Experience:
{{#each userProfile.experience}}
  * {{title}} at {{company}} ({{duration}}): {{#each details}}{{{this}}}; {{/each}}
{{/each}}

JOB DESCRIPTION:
{{{jobDescription}}}

INSTRUCTIONS:
1. ANALYZE the Job Description for key requirements, values, and "pain points".
2. ALIGN the user's specific specialist skills (especially in AI, Software Dev, and System Admin) with these requirements.
3. POSITION the user as a Specialist. Use a tone that is confident, technical, and solution-oriented.
4. HIGHLIGHT the user's ability to use modern AI tools (Cursor, Gemini, etc.) and manage complex infrastructure (Kubernetes, CI/CD).
5. STRUCTURE:
   - Strong opening that shows immediate value.
   - 2-3 body paragraphs focusing on technical alignment and specific achievements.
   - Professional closing with a clear call to action.
6. DO NOT use generic placeholders like "[Insert Date]". Start directly with the Salutation.
7. Return the result as a JSON object with 'coverLetter' (markdown) and 'reasoning' (alignment explanation).`,
});

const coverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: CoverLetterInputSchema,
    outputSchema: CoverLetterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate cover letter. Model returned no output.');
    }
    return output;
  }
);
