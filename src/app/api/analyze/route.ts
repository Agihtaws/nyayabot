import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { runGeminiAgent } from "@/lib/agents/geminiAgent";
import { runGrokAgent } from "@/lib/agents/grokAgent";
import { runMistralAgent } from "@/lib/agents/mistralAgent";
import { translateAllFields } from "@/lib/utils/translate";
import { Language } from "@/types";

export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, language } = body as {
      documentId: string;
      language: Language;
    };

    if (!documentId || !language) {
      return NextResponse.json(
        { error: "Missing documentId or language" },
        { status: 400 }
      );
    }

    // Fetch document from Supabase
    const { data: document, error: fetchError } = await supabaseAdmin
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .single();

    if (fetchError || !document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const rawText: string = document.raw_text;

    // Step 1 — Run Gemini first (the other two agents depend on its output)
    const geminiResult = await runGeminiAgent(rawText).catch(() => ({
      documentType: "unknown" as const,
      findings: [] as string[],
      problematicClauses: [] as string[],
      summary: "Analysis unavailable",
    }));

    // Step 2 — Run Grok (legal research) using Gemini's output
    const grokResult = await runGrokAgent(
      geminiResult.documentType,
      geminiResult.findings,
      rawText
    ).catch(() => ({
      relevantLaws: [],
      recentJudgments: [] as string[],
      legalSummary: "Legal research unavailable",
    }));

    // Step 3 — Run final Mistral synthesis with full Grok context
    const mistralFinal = await runMistralAgent(
      geminiResult.summary,
      geminiResult.findings,
      geminiResult.problematicClauses,
      grokResult.legalSummary,
      grokResult.relevantLaws,
      rawText
    );

    // Step 4 — Translate every user-facing field together, not just the
    // Mistral synthesis. This keeps the agent activity cards (Gemini
    // findings, Grok law descriptions/summary/judgments) consistent
    // with the rest of the page when Tamil or Hindi is selected.
    const translated = await translateAllFields(
      {
        geminiSummary: geminiResult.summary,
        geminiFindings: geminiResult.findings,
        geminiProblematicClauses: geminiResult.problematicClauses,
        grokLegalSummary: grokResult.legalSummary,
        grokRecentJudgments: grokResult.recentJudgments,
        grokLawDescriptions: grokResult.relevantLaws.map((l) => l.description),
        whatThisMeans: mistralFinal.whatThisMeans,
        yourRights: mistralFinal.yourRights,
        nextSteps: mistralFinal.nextSteps,
      },
      language
    );

    // Step 5 — Merge translated text back into each agent's result object
    const finalGeminiResult = {
      ...geminiResult,
      summary: translated.geminiSummary,
      findings: translated.geminiFindings,
      problematicClauses: translated.geminiProblematicClauses,
    };

    const finalGrokResult = {
      ...grokResult,
      legalSummary: translated.grokLegalSummary,
      recentJudgments: translated.grokRecentJudgments,
      relevantLaws: grokResult.relevantLaws.map((law, i) => ({
        ...law,
        description: translated.grokLawDescriptions[i] ?? law.description,
      })),
    };

    const finalMistralResult = {
      ...mistralFinal,
      whatThisMeans: translated.whatThisMeans,
      yourRights: translated.yourRights,
      nextSteps: translated.nextSteps,
    };

    // Build final summary from the (now translated) agent summaries
    const finalSummary = `${finalGeminiResult.summary}. ${finalGrokResult.legalSummary}`;

    // Save analysis to Supabase
    const { data: analysis, error: saveError } = await supabaseAdmin
      .from("analyses")
      .insert({
        document_id: documentId,
        gemini_result: finalGeminiResult,
        grok_result: finalGrokResult,
        mistral_result: finalMistralResult,
        final_summary: finalSummary,
        language: language,
      })
      .select()
      .single();

    if (saveError || !analysis) {
      console.error("Save analysis error:", saveError?.message);
      return NextResponse.json(
        { error: "Failed to save analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      analysisId: analysis.id,
      urgencyLevel: finalMistralResult.urgencyLevel,
    });
  } catch (error: any) {
    console.error("Analyze route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}