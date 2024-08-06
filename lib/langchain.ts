import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { HumanMessage } from "@langchain/core/messages";

const model = new ChatGoogleGenerativeAI({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
  temperature: 0.7,
  model: "gemini-1.5-flash",
  maxOutputTokens: 8192,
  topK: 64,
  topP: 0.95,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
});

export { model };

export const classifyPantryImage = async (image: string | undefined) => {
  try {
    if (image) {
      const input = [
        new HumanMessage({
          content: [
            {
              type: "text",
              text: `Please analyze the provided image and identify the grocery item depicted. Based on the visual content, classify the item and return both the name of the item and its category (e.g., fruits, vegetables, dairy, etc.). return it like this: item: itemName and category: categoryName.`,
            },
            {
              type: "image_url",
              image_url: `data:image/png;base64,${image.split(",")[1]}`,
            },
          ],
        }),
      ];

      const res = await model.invoke(input);
      return res.content;
    }
  } catch (error) {
    console.log("something went wrong:", error);
  }
};
