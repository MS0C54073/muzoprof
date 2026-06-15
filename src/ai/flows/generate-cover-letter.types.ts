/**
 * @fileOverview Type definitions for the cover letter generation flow.
 */
import {z} from 'genkit';

export const CoverLetterInputSchema = z.object({
  jobDescription: z.string().describe('The text of the job advertisement or description.'),
  userProfile: z.object({
    name: z.string(),
    title: z.string(),
    summary: z.string(),
    skills: z.array(z.string()),
    experience: z.array(z.object({
      title: z.string(),
      company: z.string(),
      duration: z.string(),
      details: z.array(z.string()),
    })),
  }).describe('The user\'s professional profile data.'),
});
export type CoverLetterInput = z.infer<typeof CoverLetterInputSchema>;

export const CoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter text in markdown format.'),
  reasoning: z.string().describe('A brief explanation of how the profile was aligned with the job description.'),
});
export type CoverLetterOutput = z.infer<typeof CoverLetterOutputSchema>;
