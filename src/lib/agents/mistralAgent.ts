import { Mistral } from "@mistralai/mistralai";
import { MistralResult } from "@/types";

function extractJSON(text: string): string {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) return jsonMatch[1];
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) return objMatch[0];
  return text;
}

export async function runMistralAgent(
  geminiSummary: string,
  geminiFindings: string[],
  geminiProblematicClauses: string[],
  grokLegalSummary: string,
  grokRelevantLaws: { name: string; section: string; description: string }[],
  rawText: string
): Promise<MistralResult> {
  const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY! });

  const lawsList = grokRelevantLaws
    .map((l) => `${l.name} Section ${l.section}: ${l.description}`)
    .join("\n");

  const prompt = `You are a compassionate legal aid advisor helping ordinary Indian citizens understand their legal rights in plain, simple language.

DOCUMENT ANALYSIS (from Gemini):
Summary: ${geminiSummary}
Key Findings: ${geminiFindings.join("; ")}
Problematic Aspects: ${geminiProblematicClauses.join("; ")}

LEGAL RESEARCH (from Grok):
Legal Context: ${grokLegalSummary}
Relevant Laws:
${lawsList}

ORIGINAL DOCUMENT EXCERPT:
${rawText.slice(0, 2000)}

Now synthesize everything into plain language that a non-lawyer can understand.

Return ONLY a valid JSON object with this exact structure. No markdown, no explanation:
{
  "whatThisMeans": "A clear 2-3 sentence explanation of what this document is asking or demanding, in simple everyday language that anyone can understand",
  "yourRights": [
    "Specific right the person has in this situation",
    "Another specific right",
    "Third right if applicable"
  ],
  "nextSteps": [
    "First concrete action the person should take",
    "Second action",
    "Third action",
    "Fourth action if needed"
  ],
  "urgencyLevel": "low|medium|high"
}

Keep language simple. Avoid legal jargon. Write as if explaining to a friend who has never dealt with legal matters.
urgencyLevel should be: high if action needed within 7 days, medium if within 30 days, low if no immediate threat.`;

  try {
    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        {
          role: "system",
          content:
            "You are a legal aid advisor for Indian citizens. Always respond with valid JSON only. Use simple, clear language.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      maxTokens: 1500,
    });

    const rawResponse =
      (response.choices?.[0]?.message?.content as string) ?? "";
    const jsonStr = extractJSON(rawResponse);
    const parsed = JSON.parse(jsonStr);

    return {
      whatThisMeans:
        parsed.whatThisMeans ?? "This document requires your attention",
      yourRights: Array.isArray(parsed.yourRights) ? parsed.yourRights : [],
      nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
      urgencyLevel: (parsed.urgencyLevel as "low" | "medium" | "high") ?? "medium",
    };
  } catch (error: any) {
    console.error("Mistral agent error:", error.message);
    return {
      whatThisMeans:
        "This document has been analyzed. Please review the findings from our legal research above.",
      yourRights: [
        "You have the right to seek free legal aid in India",
        "You have the right to respond to any legal notice",
        "You have the right to due process before any action is taken against you",
      ],
      nextSteps: [
        "Read the document carefully and note all deadlines mentioned",
        "Contact your nearest District Legal Services Authority (DLSA) for free legal advice",
        "Do not ignore this document — respond within the deadline given",
        "Keep a copy of all documents and any correspondence",
      ],
      urgencyLevel: "medium",
    };
  }
}