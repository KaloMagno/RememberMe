import { GoogleGenAI } from "@google/genai";
import { Contact } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateGiftIdeas = async (contact: Contact): Promise<string> => {
  const prompt = `
    I need gift ideas for a friend. Here is their profile:
    Name: ${contact.firstName} ${contact.lastName}
    Age Group (approx based on children/career): Adult
    Interests: ${contact.interests}
    Occupation: ${contact.occupation}
    Education: ${contact.education}
    Partner: ${contact.partnerName ? 'Yes' : 'No'}
    Children: ${contact.children.length > 0 ? 'Yes' : 'No'}

    Please suggest 3 specific, thoughtful gift ideas. 
    Format them as a clean HTML list (<ul><li><strong>Title</strong>: Description</li></ul>).
    Keep it concise.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate ideas.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to connect to AI assistant. Please check your connection.";
  }
};

export const generateIcebreaker = async (contact: Contact): Promise<string> => {
  const prompt = `
    I haven't spoken to my friend ${contact.firstName} in a while. 
    Help me write a short, casual 'catch up' text message.
    
    Context:
    - Their interests: ${contact.interests}
    - Recent life context (if any): Partner is ${contact.partnerName}, ${contact.children.length} kids.
    - Notes: ${contact.notes}

    Provide 2 distinct options:
    1. Casual/Funny
    2. Warm/Sincere
    
    Format the output as plain text with clear headings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate message.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Unable to connect to AI assistant.";
  }
};