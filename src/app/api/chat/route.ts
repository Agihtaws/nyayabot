import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabaseAdmin } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { analysisId, question, history } = await request.json();

    if (!analysisId || !question) {
      return NextResponse.json(
        { error: "Missing analysisId or question" },
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

    const systemContext = `You are NyayaBot, a legal aid assistant for Indian citizens. You have already analyzed a legal document for this user. Answer their follow-up questions based on that analysis and your knowledge of Indian law.

DOCUMENT ANALYSIS CONTEXT:
Document Type: ${geminiResult.documentType}
Summary: ${geminiResult.summary}
Key Findings: ${geminiResult.findings?.join("; ")}
Problematic Clauses: ${geminiResult.problematicClauses?.join("; ")}
Relevant Laws: ${grokResult.relevantLaws?.map((l: any) => `${l.name} §${l.section}`).join(", ")}
Legal Summary: ${grokResult.legalSummary}
Person's Rights: ${mistralResult.yourRights?.join("; ")}
Recommended Next Steps: ${mistralResult.nextSteps?.join("; ")}
Original Document Excerpt: ${rawText.slice(0, 1500)}

CONVERSATION HISTORY:
${(history || []).map((h: any) => `${h.role === "user" ? "User" : "NyayaBot"}: ${h.content}`).join("\n")}

Now answer the user's latest question. Be helpful, specific to their situation, and use plain language. Keep response concise — 3 to 5 sentences unless more detail is truly needed. Always ground your answer in Indian law.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            {
              text: `${systemContext}\n\nUser question: ${question}`,
            },
          ],
        },
      ],
      config: { temperature: 0.3 },
    });

    const answer = response.text?.trim() ?? "";

    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("Chat route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}