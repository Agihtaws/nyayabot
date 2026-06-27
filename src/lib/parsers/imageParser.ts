import { createWorker } from "tesseract.js";
import { GoogleGenAI } from "@google/genai";

async function parseWithGeminiVision(
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
            text: "Extract all text from this image exactly as it appears. Return only the raw extracted text, nothing else.",
          },
        ],
      },
    ],
  });

  const text = response.text?.trim() ?? "";

  if (!text || text.length < 10) {
    throw new Error("Could not extract readable text from image");
  }

  return text;
}

export async function parseImage(
  buffer: Buffer,
  mimeType: string
): Promise<string> {
  let worker;

  try {
    worker = await createWorker("eng");
    const {
      data: { text },
    } = await worker.recognize(buffer);
    await worker.terminate();
    worker = undefined;

    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

    if (wordCount >= 30) {
      return text.trim();
    }

    console.log("Tesseract low output — falling back to Gemini Vision");
    return await parseWithGeminiVision(buffer, mimeType);
  } catch {
    if (worker) {
      try {
        await worker.terminate();
      } catch {}
    }
    console.log("Tesseract failed — falling back to Gemini Vision");
    return await parseWithGeminiVision(buffer, mimeType);
  }
}