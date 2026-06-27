import { GrokResult } from "@/types";

function extractJSON(text: string): string {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (jsonMatch) return jsonMatch[1];
  const objMatch = text.match(/\{[\s\S]*\}/);
  if (objMatch) return objMatch[0];
  return text;
}

export async function runGrokAgent(
  documentType: string,
  findings: string[],
  rawText: string
): Promise<GrokResult> {
  const prompt = `You are a senior Indian legal expert with deep knowledge of Indian law, IPC, CPC, and state-specific regulations.

DOCUMENT TYPE: ${documentType}
KEY FINDINGS: ${findings.join("; ")}
DOCUMENT EXCERPT: ${rawText.slice(0, 3000)}

Based on this legal document, identify the most relevant Indian laws, acts, and legal protections that apply.

Return ONLY a valid JSON object with this exact structure. No markdown, no explanation:
{
  "relevantLaws": [
    {
      "name": "Full name of the Act or Law",
      "section": "Specific section number that applies",
      "description": "What this section says and how it protects the person",
      "url": "https://indiankanoon.org or leave empty string"
    }
  ],
  "recentJudgments": [
    "Brief description of a relevant Supreme Court or High Court ruling on similar matters",
    "Another relevant judgment"
  ],
  "legalSummary": "2-3 sentence overview of the legal landscape for this type of document and the person's general legal standing"
}

Include 2-4 relevant laws and 1-2 judgments. Be specific to Indian jurisdiction only.`;

  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are an expert in Indian law. Always respond with valid JSON only. No markdown.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.1,
          max_tokens: 1500,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API error: ${response.status} — ${errText}`);
    }

    const data = await response.json();
    const rawResponse = data.choices?.[0]?.message?.content ?? "";
    const jsonStr = extractJSON(rawResponse);
    const parsed = JSON.parse(jsonStr);

    return {
      relevantLaws: Array.isArray(parsed.relevantLaws)
        ? parsed.relevantLaws
        : [],
      recentJudgments: Array.isArray(parsed.recentJudgments)
        ? parsed.recentJudgments
        : [],
      legalSummary:
        parsed.legalSummary ?? "Legal context analyzed based on Indian law",
    };
  } catch (error: any) {
    console.error("Groq agent error:", error.message);
    return {
      relevantLaws: [
        {
          name: "Constitution of India",
          section: "Article 21",
          description:
            "Right to life and personal liberty — no person shall be deprived of their rights except by procedure established by law",
          url: "https://indiankanoon.org/doc/1199182/",
        },
      ],
      recentJudgments: [
        "Courts have consistently held that procedural fairness must be followed in legal notices",
      ],
      legalSummary:
        "Your situation may have legal remedies available under Indian law. Consulting a legal aid center is recommended.",
    };
  }
}