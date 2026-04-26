
'use server';
/**
 * @fileOverview A server-side flow for translating a batch of texts using Google's AI.
 * This is more efficient than sending multiple individual requests.
 *
 * - translateBatch: The main function to translate an array of texts.
 */
import { ai } from '@/ai/ai-instance';
import type {
  TranslateBatchInput,
  TranslateBatchOutput,
} from './translate-batch.types';
import { TranslateBatchOutputSchema } from './translate-batch.types';

/**
 * A server action that translates a batch of texts to a specified language.
 *
 * @param input An object containing the texts array and targetLanguage.
 * @returns A promise that resolves to an object with the translations array.
 */
export async function translateBatch(input: TranslateBatchInput): Promise<TranslateBatchOutput> {
  const { texts, targetLanguage } = input;

  // Fallback: If no texts or English is requested, return original texts.
  if (!texts || texts.length === 0 || targetLanguage === 'en') {
    return { translations: texts };
  }

  if (!process.env.GOOGLE_GENAI_API_KEY) {
    console.warn("GOOGLE_GENAI_API_KEY environment variable not set. Translation falling back to original text.");
    return { translations: texts };
  }

  // Create a numbered list of texts for the prompt to ensure the model maintains order.
  const numberedTexts = texts.map((text, index) => `${index + 1}. "${text}"`).join('\n');

  // Provide a robust default prompt template if the env var is missing.
  const defaultTemplate = `You are a professional translator. Translate the following list of texts from English into {{targetLanguage}}. 
Maintain the original tone, context, and formatting. Do not translate technical terms or proper names unless they have standard equivalents.
Return the translations as a JSON object with a 'translations' field containing an array of strings in the exact same order as provided.

Texts to translate:
{{numberedTexts}}`;

  const promptTemplate = process.env.PROMPT_TRANSLATE_BATCH || defaultTemplate;
  
  // Resolve language code to human-readable name
  const languageName = targetLanguage === 'ru' ? 'Russian' : targetLanguage;

  const promptText = promptTemplate
      .replace('{{targetLanguage}}', languageName)
      .replace('{{numberedTexts}}', numberedTexts);

  try {
    const response = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: promptText,
      output: {
        schema: TranslateBatchOutputSchema,
      },
      config: {
        safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
      }
    });
    
    const output = response.output;

    // Validate the output structure and length to ensure consistency.
    if (output && Array.isArray(output.translations) && output.translations.length === texts.length) {
        return output;
    }

    console.warn('Batch translation returned mismatched length, falling back to original.');
    return { translations: texts };

  } catch (error) {
    console.error(
        `Batch translation failed for ${texts.length} texts to "${targetLanguage}". Returning original.`,
        error
    );
    return { translations: texts };
  }
}
