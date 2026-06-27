import { GoogleGenAI } from "@google/genai";

export async function parseImage(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const base64 = buffer.toString("base64");

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          {
            inlineData: {
              data: base64,
              mimeType: mimeType,
            },
          },
          {
            text: "Extract all text from this image exactly as it appears. Return only the raw extracted text, no explanation, nothing else. If the image is blurry or unclear, extract whatever text you can identify.",
          },
        ],
      },
    ],
    config: { temperature: 0 },
  });

  const text = response.text?.trim() ?? "";

  if (!text || text.length < 10) {
    throw new Error(
      "Could not extract readable text from image. Please try a clearer photo."
    );
  }

  return text;
}