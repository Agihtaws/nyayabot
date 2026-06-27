import { GoogleGenAI } from "@google/genai";
import { Language } from "@/types";

function extractJSON(text: string): string {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) return jsonMatch[1];
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) return objMatch[0];
  return text;
}

export interface TranslatableFields {
  // Gemini fields
  geminiSummary: string;
  geminiFindings: string[];
  geminiProblematicClauses: string[];
  // Grok fields
  grokLegalSummary: string;
  grokRecentJudgments: string[];
  grokLawDescriptions: string[];
  // Mistral fields
  whatThisMeans: string;
  yourRights: string[];
  nextSteps: string[];
}

/**
 * Translates every user-facing text field produced by the three agents
 * into the selected language. Previously only the Mistral fields
 * (whatThisMeans / yourRights / nextSteps) were translated, leaving the
 * agent activity cards (Gemini findings, Grok law summaries) in English
 * even when Tamil or Hindi was selected. This now covers all of them
 * in a single Gemini call so the whole results page is consistent.
 */
export async function translateAllFields(
  fields: TranslatableFields,
  language: Language
): Promise<TranslatableFields> {
  if (language === "english") return fields;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const langName = language === "tamil" ? "Tamil" : "Hindi";

  const prompt = `Translate the following JSON from English to ${langName}.

Rules:
- Keep proper nouns exactly as they are (names of people, places, companies)
- Keep law names in English (e.g. "Transfer of Property Act", "IPC", "CPC")
- Keep section numbers in English (e.g. "Section 106", "Article 21")
- Keep rupee amounts and numbers as they are
- Translate everything else naturally into ${langName}
- Preserve the exact same JSON structure and array lengths as the input
- Return ONLY valid JSON, no explanation, no markdown

JSON to translate:
${JSON.stringify(fields, null, 2)}`;

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
      geminiSummary: parsed.geminiSummary ?? fields.geminiSummary,
      geminiFindings: Array.isArray(parsed.geminiFindings)
        ? parsed.geminiFindings
        : fields.geminiFindings,
      geminiProblematicClauses: Array.isArray(parsed.geminiProblematicClauses)
        ? parsed.geminiProblematicClauses
        : fields.geminiProblematicClauses,
      grokLegalSummary: parsed.grokLegalSummary ?? fields.grokLegalSummary,
      grokRecentJudgments: Array.isArray(parsed.grokRecentJudgments)
        ? parsed.grokRecentJudgments
        : fields.grokRecentJudgments,
      grokLawDescriptions: Array.isArray(parsed.grokLawDescriptions)
        ? parsed.grokLawDescriptions
        : fields.grokLawDescriptions,
      whatThisMeans: parsed.whatThisMeans ?? fields.whatThisMeans,
      yourRights: Array.isArray(parsed.yourRights)
        ? parsed.yourRights
        : fields.yourRights,
      nextSteps: Array.isArray(parsed.nextSteps)
        ? parsed.nextSteps
        : fields.nextSteps,
    };
  } catch (error: any) {
    console.error("Translation error:", error.message);
    return fields;
  }
}

/**
 * @deprecated Use translateAllFields instead. Kept temporarily in case
 * any other code still imports the old narrower function.
 */
export async function translateFields(
  fields: {
    whatThisMeans: string;
    yourRights: string[];
    nextSteps: string[];
  },
  language: Language
): Promise<{
  whatThisMeans: string;
  yourRights: string[];
  nextSteps: string[];
}> {
  if (language === "english") return fields;

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  const langName = language === "tamil" ? "Tamil" : "Hindi";

  const prompt = `Translate the following JSON fields from English to ${langName}. 
Keep proper nouns, law names, and section numbers in English.
Return ONLY the translated JSON object, no explanation:

${JSON.stringify(fields, null, 2)}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: { temperature: 0.1 },
    });

    const rawResponse = response.text ?? "";
    const jsonMatch = rawResponse.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonStr = jsonMatch
      ? jsonMatch[1]
      : rawResponse.match(/\{[\s\S]*\}/)?.[0] ?? rawResponse;
    const parsed = JSON.parse(jsonStr);

    return {
      whatThisMeans: parsed.whatThisMeans ?? fields.whatThisMeans,
      yourRights: Array.isArray(parsed.yourRights)
        ? parsed.yourRights
        : fields.yourRights,
      nextSteps: Array.isArray(parsed.nextSteps)
        ? parsed.nextSteps
        : fields.nextSteps,
    };
  } catch (error: any) {
    console.error("Translation error:", error.message);
    return fields;
  }
}