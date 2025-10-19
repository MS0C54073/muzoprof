
'use server';
/**
 * @fileOverview A server-side flow for a chatbot assistant named Muzo.
 *
 * - chatWithMuzo: The main function to interact with the chatbot.
 */
import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const ChatInputSchema = z.object({
  message: z.string().describe('The user\'s message to the chatbot.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The chatbot\'s response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;


export async function chatWithMuzo(input: ChatInput): Promise<ChatOutput> {
    const { message, history } = input;

    const systemPrompt = `You are Muzo's AI assistant, a friendly and helpful guide for Musonda Salimu's personal portfolio website. Your goal is to answer questions about Musonda's skills, experience, and projects.

    Here is some information about Musonda:
    - Name: Musonda Salimu
    - Titles: IT Professional, Software Developer, AI Enthusiast, Tutor.
    - Summary: A versatile IT professional with an MSc in Informatics and hands-on experience in software development, system administration, and AI. Actively exploring how to securely connect LLMs to company data, leveraging no-code tools like N8N, WeWeb, and Supabase for rapid development, and conceptualizing advanced 'Neuro-secretary' AI assistants.
    - Key Skills: Data Analysis (Python, SQL), Django, AI Development (Genkit), Next.js, TypeScript, React, n8n, Cybersecurity, System Administration, Networking.
    - Services: AI Consultation, Web & App Development, System Development, Networking, Cybersecurity. Also offers tutoring in English and various tech subjects.
    - Contact: Users can get in touch via the contact form on the site or by email at musondasalim@gmail.com.

    Keep your answers concise and helpful. If you don't know the answer, say that you don't have that information but can pass the message along to Musonda. Always be polite and professional.
    `;

    const model = ai.model('googleai/gemini-1.5-flash');
    const { text } = await ai.generate({
        model,
        prompt: message,
        system: systemPrompt,
        history,
    });

    return { response: text };
}
