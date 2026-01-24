
/**
 * @fileOverview Type definitions for the career portal generation flow.
 */
import {z} from 'genkit';

export const CareerPortalInputSchema = z.object({
  resumePdfDataUri: z.string().describe(
    "A PDF resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:application/pdf;base64,<encoded_data>'."
  ),
});
export type CareerPortalInput = z.infer<typeof CareerPortalInputSchema>;

const ExperienceSchema = z.object({
    title: z.string().describe('The job title or position.'),
    company: z.string().describe('The name of the company or organization.'),
    duration: z.string().describe('The start and end dates of the employment (e.g., "Jan 2020 - Present").'),
    details: z.array(z.string()).describe('A list of responsibilities or achievements in this role.'),
});

const EducationSchema = z.object({
    degree: z.string().describe('The degree or qualification obtained (e.g., "Master of Science").'),
    university: z.string().describe('The name of the institution.'),
    duration: z.string().describe('The start and end dates of study.'),
});

const ProjectSchema = z.object({
    title: z.string().describe('The name of the project.'),
    description: z.string().describe('A brief description of the project.'),
    link: z.string().optional().describe('A URL to the project if available.'),
});

export const CareerPortalOutputSchema = z.object({
  name: z.string().describe('The full name of the person.'),
  title: z.string().describe('The professional title, e.g., "Software Engineer".'),
  summary: z.string().describe('A 2-3 sentence professional summary.'),
  contact: z.object({
    email: z.string().optional().describe('Email address.'),
    phone: z.string().optional().describe('Phone number.'),
    linkedin: z.string().optional().describe('URL to LinkedIn profile.'),
    github: z.string().optional().describe('URL to GitHub profile.'),
    website: z.string().optional().describe('URL to a personal website or portfolio.'),
  }).describe('Contact information.'),
  skills: z.array(z.string()).describe('A list of key technical and professional skills.'),
  experience: z.array(ExperienceSchema).describe('A list of professional experiences.'),
  education: z.array(EducationSchema).describe('A list of educational qualifications.'),
  projects: z.array(ProjectSchema).describe('A list of personal or professional projects.'),
});
export type CareerPortalOutput = z.infer<typeof CareerPortalOutputSchema>;
