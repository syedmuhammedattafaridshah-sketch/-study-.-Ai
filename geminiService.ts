import { GoogleGenAI, Type } from "@google/genai";
import { QuestionConfig, TestData, FileData, ChatMessage, Difficulty } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const modelId = "gemini-2.5-flash";

export const chatWithStudyAI = async (history: ChatMessage[], newMessage: string): Promise<string> => {
  const historyConverted = history.map(h => ({
    role: h.role,
    parts: [{ text: h.text }]
  }));

  const chatSession = ai.chats.create({
    model: modelId,
    history: historyConverted,
    config: {
      systemInstruction: "You are 'Study AI'. An advanced academic assistant with a futuristic, helpful, and intelligent persona. Keep responses precise and insightful."
    }
  });

  const result = await chatSession.sendMessage({ message: newMessage });
  return result.text || "Neural connection interrupted. No response received.";
};

export const generateTestFromContent = async (
  file: FileData | null,
  textContext: string,
  config: QuestionConfig
): Promise<TestData> => {
  
  let instructions = "";
  if (config.topicFocus && config.topicFocus.trim() !== "") {
    instructions += `IMPORTANT: Focus the test specifically on this topic, chapter, or page range: "${config.topicFocus}". Ignore unrelated content.\n`;
  }

  // Distinct Difficulty Logic
  switch (config.difficulty) {
    case Difficulty.Simple:
      instructions += `DIFFICULTY INSTRUCTION: Generate 'Simple' questions. Focus on basic recall, definitions, and fundamental facts. Questions should be straightforward and easy to answer directly from the text.\n`;
      break;
    case Difficulty.Medium:
      instructions += `DIFFICULTY INSTRUCTION: Generate 'Medium' questions. Balance simple recall with some application. Standard academic difficulty suitable for a general assessment.\n`;
      break;
    case Difficulty.Hard:
      instructions += `DIFFICULTY INSTRUCTION: Generate 'Hard' questions. Focus on complex analysis, synthesis, and application of concepts to novel situations. questions should require critical thinking.\n`;
      break;
    case Difficulty.Conceptual:
      instructions += `DIFFICULTY INSTRUCTION: Generate 'Conceptual' questions. Focus deeply on the 'why' and 'how'. Test understanding of underlying theories, relationships between ideas, and abstract principles rather than rote memorization.\n`;
      break;
    case Difficulty.Important:
      instructions += `DIFFICULTY INSTRUCTION: Generate 'Important' questions. Identify and focus strictly on the most critical, high-value, and frequently tested concepts in the material. Filter out trivial details.\n`;
      break;
    default:
      instructions += `DIFFICULTY INSTRUCTION: Standard academic difficulty.\n`;
  }

  const prompt = `
    Act as an expert educational content creator.
    Generate a comprehensive test based on the provided content.
    
    Configuration:
    - Difficulty Level: ${config.difficulty}
    - MCQs: ${config.mcqCount}
    - Short Answer: ${config.shortQCount}
    - Long Answer: ${config.longQCount}
    - True/False: ${config.tfCount}
    - Fill in Blanks: ${config.blankCount}
    - Essay Questions: ${config.essayCount}
    - Matching Pairs: ${config.matchCount}

    ${instructions}

    Requirements:
    - Ensure questions strictly match the '${config.difficulty}' difficulty level description above.
    - Long Answer questions should require a detailed, paragraph-length response.
    - Provide a professional and relevant title for the test.
    - Return strictly JSON format.
  `;

  const parts: any[] = [{ text: prompt }];

  if (file) {
    parts.push({
      inlineData: {
        mimeType: file.mimeType,
        data: file.data,
      },
    });
  }

  if (textContext.trim()) {
    parts.push({
      text: `Context Content:\n${textContext}`,
    });
  }

  const response = await ai.models.generateContent({
    model: modelId,
    contents: { parts: parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          subtitle: { type: Type.STRING },
          mcqs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                answer: { type: Type.STRING },
              },
              required: ["question", "options", "answer"],
            },
          },
          shortQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answerKey: { type: Type.STRING },
              },
              required: ["question", "answerKey"],
            },
          },
          longQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                answerKey: { type: Type.STRING, description: "Detailed answer key for the long question" },
              },
              required: ["question", "answerKey"],
            },
          },
          trueFalse: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                statement: { type: Type.STRING },
                isTrue: { type: Type.BOOLEAN },
              },
              required: ["statement", "isTrue"],
            },
          },
          fillInBlanks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sentence: { type: Type.STRING },
                answer: { type: Type.STRING },
              },
              required: ["sentence", "answer"],
            },
          },
          essays: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                keyPoints: { type: Type.STRING },
              },
              required: ["question", "keyPoints"],
            },
          },
          matching: {
            type: Type.ARRAY,
            items: {
               type: Type.OBJECT,
               properties: {
                 pairs: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            item: { type: Type.STRING },
                            match: { type: Type.STRING }
                        },
                        required: ["item", "match"]
                    }
                 }
               },
               required: ["pairs"]
            }
          }
        },
        required: ["title", "mcqs", "shortQuestions", "longQuestions", "trueFalse", "fillInBlanks", "essays", "matching"],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response generated from Gemini.");
  }

  return JSON.parse(response.text) as TestData;
};