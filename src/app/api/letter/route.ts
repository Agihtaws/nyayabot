import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabaseAdmin } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { analysisId } = await request.json();

    if (!analysisId) {
      return NextResponse.json(
        { error: "Missing analysisId" },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("analyses")
      .select("*, documents(*)")
      .eq("id", analysisId)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    const geminiResult = data.gemini_result;
    const grokResult = data.grok_result;
    const mistralResult = data.mistral_result;
    const rawText = data.documents?.raw_text ?? "";

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    const prompt = `You are a professional legal advocate helping ordinary Indian citizens respond to legal notices.

ORIGINAL DOCUMENT SUMMARY: ${geminiResult.summary}
DOCUMENT TYPE: ${geminiResult.documentType}
PROBLEMATIC CLAUSES IDENTIFIED: ${geminiResult.problematicClauses?.join("; ")}
RELEVANT LAWS: ${grokResult.relevantLaws?.map((l: any) => `${l.name} Section ${l.section}`).join(", ")}
PERSON'S RIGHTS: ${mistralResult.yourRights?.join("; ")}
ORIGINAL DOCUMENT EXCERPT: ${rawText.slice(0, 2000)}

Write a formal, professional legal reply letter that:
1. Formally acknowledges receipt of the notice
2. Disputes or responds to each problematic clause specifically
3. Cites the relevant Indian laws and sections that protect the recipient
4. States the recipient's legal position clearly and firmly
5. Requests proper legal procedure be followed
6. Uses formal legal letter format with proper salutation and closing

Format the letter exactly like this:
---
[Date]

[Sender Name]
[Sender Address]

To,
[Recipient Name — the person who sent the original notice]
[Recipient Address]

Subject: Reply to Legal Notice dated [date from original document]

Dear Sir/Madam,

[Body paragraphs]

Yours faithfully,

[Recipient of original notice — the person defending themselves]
---

Write the complete letter. Use [PLACEHOLDER] for any information not available in the document. Make it firm but professional.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts: [{ text: prompt }] }],
      config: { temperature: 0.2 },
    });

    const letter = response.text?.trim() ?? "";

    if (!letter) {
      throw new Error("Failed to generate letter");
    }

    return NextResponse.json({ letter });
  } catch (error: any) {
    console.error("Letter route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}