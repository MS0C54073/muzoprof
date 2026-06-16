'use server';
/**
 * @fileOverview A server-side flow for generating a personal career portal from a resume PDF.
 */

import { ai } from '@/ai/ai-instance';
import { googleAI } from '@genkit-ai/google-genai';
import {
  CareerPortalInputSchema,
  CareerPortalOutputSchema,
  type CareerPortalInput,
  type CareerPortalOutput,
} from './generate-career-portal.types';

const prompt = ai.definePrompt({
  name: 'careerPortalPrompt',
  model: googleAI.model('gemini-flash-latest'),
  input: { schema: CareerPortalInputSchema },
  output: { schema: CareerPortalOutputSchema },
  prompt: `You are an expert resume analyzer and career portal generator. Your task is to analyze the provided PDF resume and extract the relevant information to populate a structured career portal.

Strictly adhere to the output JSON schema. Extract information for each field as accurately as possible. Infer section headings and structure from the document layout. If some information (like 'projects' or 'awards') is not present, return an empty array for that field. For experience and education, list items in reverse chronological order (most recent first).

Resume for analysis: {{media url=resumePdfDataUri}}`,
});

const careerPortalFlow = ai.defineFlow(
  {
    name: 'generateCareerPortalFlow',
    inputSchema: CareerPortalInputSchema,
    outputSchema: CareerPortalOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate career portal from resume. The model returned no output.');
    }
    return output;
  }
);

/**
 * A server action that analyzes a resume PDF and generates structured data for a career portal.
 */
export async function generateCareerPortal(
  input: CareerPortalInput
): Promise<CareerPortalOutput> {
  if (!process.env.GOOGLE_GENAI_API_KEY) {
    throw new Error('The GOOGLE_GENAI_API_KEY environment variable is not set.');
  }
  return await careerPortalFlow(input);
}
