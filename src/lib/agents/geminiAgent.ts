import { GoogleGenAI } from "@google/genai";
import { AgentResult, DocumentType } from "@/types";

function extractJSON(text: string): string {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) return jsonMatch[1];
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) return objMatch[0];
  return text;
}

export async function runGeminiAgent(rawText: string): Promise<AgentResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

  const prompt = `You are a legal document analyzer specializing in Indian law. Analyze this document carefully.

DOCUMENT:
${rawText.slice(0, 8000)}

Return ONLY a valid JSON object with this exact structure. No markdown, no explanation, no extra text:
{
  "documentType": "rental_notice|tax_notice|termination_letter|court_summons|consumer_complaint|government_notice|unknown",
  "findings": [
    "specific factual finding from the document",
    "another specific finding",
    "third finding"
  ],
  "problematicClauses": [
    "specific clause or demand that may be legally problematic",
    "another problematic aspect"
  ],
  "summary": "One clear sentence describing what this document is and its main demand or purpose"
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: { temperature: 0.1 },
    });

    const rawResponse = response.text ?? "";
    const jsonStr = extractJSON(rawResponse);
    const parsed = JSON.parse(jsonStr);

    return {
      documentType: (parsed.documentType as DocumentType) ?? "unknown",
      findings: Array.isArray(parsed.findings) ? parsed.findings : [],
      problematicClauses: Array.isArray(parsed.problematicClauses)
        ? parsed.problematicClauses
        : [],
      summary: parsed.summary ?? "Document analyzed successfully",
    };
  } catch (error: any) {
    console.error("Gemini agent error:", error.message);
    return {
      documentType: "unknown",
      findings: ["Document was analyzed but structured extraction failed"],
      problematicClauses: [],
      summary: "Document received and processed",
    };
  }
}