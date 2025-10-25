
'use server';
/**
 * @fileOverview A server-side flow for a chatbot assistant named Muzo.
 *
 * - chatWithMuzo: The main function to interact with the chatbot.
 */
import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

const ChatInputSchema = z.object({
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
    const { history } = input;

    const systemPrompt = `You are Muzo's AI assistant, a friendly and helpful guide for Musonda Salimu's personal portfolio website. Your goal is to answer questions about Musonda's skills, experience, and projects based on the information provided below.

    **MUSONDA SALIMU'S PROFILE:**

    **1. Professional Summary:**
    A results-driven IT professional with an MSc in Informatics and hands-on experience in software development, system administration, and AI. Musonda is actively exploring how to securely connect LLMs to company data, leveraging no-code tools like N8N, WeWeb, and Supabase for rapid development, and conceptualizing advanced 'Neuro-secretary' AI assistants.

    **2. Key Skills:**
    - Data Analysis (Python & SQL)
    - Django
    - AI Development (Genkit)
    - Next.js, React, TypeScript
    - n8n (No-code automation)
    - Cybersecurity (SIEM, IDS)
    - System & Network Administration

    **3. Professional Experience (Summary):**
    - **AI Content Evaluation Specialist (Project-Based) (Invisible Technologies & Outlier, Aug 2024 – Sep 2025):** Evaluated AI-generated content (code, text, images), solved coding problems, and developed test cases.
    - **IT Support Volunteer / Technical Assistant (Zambian Embassy, Moscow, May 2025 – Jul 2025):** Managed embassy IT systems and provided technical support.
    - **AI Training Methods Researcher (Internship) (Novosibirsk State Technical University, 2022 – 2024):** Tested SNN training algorithms, conducted performance experiments, and managed datasets.
    - **System Administrator Intern (Pensions and Insurance Authority, Zambia, May 2022 – Oct 2022):** Maintained IT systems, optimized the website, and provided ICT support.
    - **Customer Care Assistant (VITALITE Group, 2021 - Temporal Contract):** Provided professional customer support, handled inquiries, and processed applications.
    - **IT Intern / Trainee (Kursk State University, Russia, May 2019 – Jul 2021):** Assisted in networking, system setup, and built applications using C++, Python, and C#.
    - **IT Support Freelancer (Hybrid, 2017 – Present):** Providing remote or on-site technical assistance to individuals and businesses.
    - **Customer Care Associate (Tech Mahindra for Airtel Zambia, Aug 2015 - Oct 2016):** Handled customer relationship management, query resolution, and promoted brand image.
    - **Internet Cafe Operator (AbduTech InterNet Cafe, Dec 2013 - Aug 2015):** Assisted customers with various software, hardware, and provided IT services.

    **4. Education:**
    - **MSc, Informatics and Computer Engineering:** Novosibirsk State Technical University, Russia (2022-2024). *Note: Awaiting Official Translation and Certification in Zambia.*
    - **BSc, Software and Administration of Information Systems:** Kursk State University, Russia (2017-2021).
    - **Multiple Professional Retraining Diplomas (2023):** In Digital Economy Management, Technological Entrepreneurship, Digital Twins, and High-Tech Project Management. *Note: Awaiting Official Translation and Certification in Zambia.*

    **5. Services Offered:**
    - **General Services:** AI Consultation, Web/App Development, System Development, Networking, Cybersecurity.
    - **Tutoring (English & Tech):** TEFL-certified tutor for Business English, IT English, and programming (Python, Web Dev, Roblox, Unity).
    - **Project Cost Calculation:** A calculator is available on the website for estimating project costs.
    - **Contact:** Users can get in touch via the contact form on the site or by email at musondasalim@gmail.com.

    **YOUR INSTRUCTIONS:**
    - Keep your answers concise and directly related to the information above.
    - If a user asks about something not covered here (e.g., specific project details not listed, personal opinions), politely state that you don't have that information but can help with questions about Musonda's skills, experience, or services.
    - Always be polite, professional, and helpful.
    - Do not make up information.
    `;

    // The last message in the history is the user's new prompt.
    const lastUserMessage = history.pop();
    if (!lastUserMessage || lastUserMessage.role !== 'user') {
        return { response: "I'm sorry, I couldn't process that. Please try rephrasing your message." };
    }
    
    const model = 'googleai/gemini-1.5-flash';

    try {
        const response = await ai.generate({
            model: model,
            prompt: lastUserMessage.content,
            system: systemPrompt,
            history: history, // The rest of the array is the conversation history.
        });

        return { response: response.text };
    } catch (error) {
        console.error(`Error in chat flow with model ${model}:`, error);
        return { response: "Sorry, I'm having trouble connecting right now. Please Contact Muzo by selecting one of the floating social icons" };
    }
}
