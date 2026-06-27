"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { AnalysisResult, DocumentType, Language } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Scale,
  Gavel,
  Shield,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Info,
  ExternalLink,
  ArrowLeft,
  Loader2,
  FileText,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LetterModal from "@/components/results/LetterModal";
import ChatSection from "@/components/results/ChatSection";
import { useTranslation, DictionaryKey } from "@/lib/i18n";

const DOC_TYPE_KEY: Record<DocumentType, DictionaryKey> = {
  rental_notice: "docType.rental_notice",
  tax_notice: "docType.tax_notice",
  termination_letter: "docType.termination_letter",
  court_summons: "docType.court_summons",
  consumer_complaint: "docType.consumer_complaint",
  government_notice: "docType.government_notice",
  unknown: "docType.unknown",
};

function UrgencyBadge({
  level,
  t,
}: {
  level: "low" | "medium" | "high";
  t: (key: DictionaryKey) => string;
}) {
  if (level === "high")
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-urgent/10 text-urgent border border-urgent/25">
        <AlertTriangle className="w-3 h-3" />
        {t("result.urgency.high")}
      </span>
    );
  if (level === "medium")
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-caution/15 text-caution-foreground border border-caution/30">
        <Info className="w-3 h-3" />
        {t("result.urgency.medium")}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rights/10 text-rights border border-rights/25">
      <CheckCircle className="w-3 h-3" />
      {t("result.urgency.low")}
    </span>
  );
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLetter, setShowLetter] = useState(false);

  // Falls back to English until the analysis (with its stored language)
  // has loaded, so the loading/error states still render in English.
  const t = useTranslation((analysis?.language ?? "english") as Language);

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        const { data, error } = await supabase
          .from("analyses")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error || !data) {
          setError("Analysis not found");
          return;
        }

        setAnalysis({
          id: data.id,
          documentId: data.document_id,
          geminiResult: data.gemini_result,
          grokResult: data.grok_result,
          mistralResult: data.mistral_result,
          finalSummary: data.final_summary,
          language: data.language,
          createdAt: data.created_at,
        });
      } catch {
        setError("Failed to load analysis");
      } finally {
        setLoading(false);
      }
    }

    if (params.id) fetchAnalysis();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-sm text-muted-foreground">{t("result.loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error ?? t("result.notFound")}</p>
          <Button onClick={() => router.push("/")}>{t("result.goBack")}</Button>
        </div>
      </div>
    );
  }

  const { geminiResult, grokResult, mistralResult } = analysis;

  const legalAidResources = [
    {
      name: "National Legal Services Authority",
      desc: t("result.resource.nalsa"),
      url: "https://nalsa.gov.in",
    },
    {
      name: "eCourts India",
      desc: t("result.resource.ecourts"),
      url: "https://ecourts.gov.in",
    },
    {
      name: "Indian Kanoon",
      desc: t("result.resource.indiankanoon"),
      url: "https://indiankanoon.org",
    },
    {
      name: "TN State Legal Services",
      desc: t("result.resource.tnslsa"),
      url: "https://tnslsa.tn.gov.in",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Scale className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-serif font-semibold">NyayaBot</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="gap-1.5 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t("nav.analyzeAnother")}</span>
            <span className="sm:hidden">{t("nav.new")}</span>
          </Button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 pt-20 sm:pt-24 pb-16">
        {/* 1. Hero — status + what happens next, leads everything */}
        <div className="notice-edge relative rounded-2xl overflow-hidden border border-border bg-card pt-7 pb-6 sm:pb-8 px-5 sm:px-8 mb-5 mt-2">
          <div className="relative space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="capitalize text-xs font-semibold">
                <FileText className="w-3 h-3 mr-1" />
                {t(DOC_TYPE_KEY[geminiResult.documentType] ?? "docType.unknown")}
              </Badge>
              <UrgencyBadge level={mistralResult.urgencyLevel} t={t} />
            </div>
            <h1 className="text-xl sm:text-3xl font-serif font-semibold tracking-tight">
              {t("result.heading")}
            </h1>
            <p className="text-muted-foreground leading-relaxed max-w-2xl text-sm sm:text-base">
              {geminiResult.summary}
            </p>

            <div className="flex flex-wrap gap-2 sm:gap-3 pt-1">
              <Button
                onClick={() => setShowLetter(true)}
                className="gap-2 font-semibold"
                size="sm"
              >
                <FileText className="w-4 h-4" />
                {t("result.generateLetter")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() =>
                  document.getElementById("ask-a-question")?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <MessageCircle className="w-4 h-4" />
                {t("result.askQuestion")}
              </Button>
            </div>
          </div>
        </div>

        {/* 2. What this document means, in plain language */}
        <Card className="mb-4 border border-primary/20 bg-primary/[0.04] overflow-hidden">
          <div className="p-5 sm:p-6 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center shrink-0">
                <Info className="w-3.5 h-3.5 text-primary" />
              </div>
              <h2 className="font-serif font-semibold text-primary text-base">
                {t("result.whatThisMeans")}
              </h2>
            </div>
            <p className="text-foreground leading-relaxed text-sm sm:text-base">
              {mistralResult.whatThisMeans}
            </p>
          </div>
        </Card>

        {/* 3. Rights + Next steps — the action zone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <Card className="border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-rights/10 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-rights" />
              </div>
              <h2 className="font-semibold text-sm">{t("result.yourRights")}</h2>
            </div>
            <ul className="space-y-3">
              {mistralResult.yourRights.map((right, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <CheckCircle className="w-4 h-4 text-rights shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {right}
                  </p>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <ArrowRight className="w-3.5 h-3.5 text-primary" />
              </div>
              <h2 className="font-semibold text-sm">{t("result.whatToDoNext")}</h2>
            </div>
            <ol className="space-y-3">
              {mistralResult.nextSteps.map((step, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* 4. Ask a follow-up — given a real anchor + visible header, not buried */}
        <div id="ask-a-question" className="mb-4 scroll-mt-20">
          <ChatSection
            analysisId={analysis.id}
            documentType={geminiResult.documentType}
            language={analysis.language}
          />
        </div>

        {/* 5. Relevant laws — supporting evidence, less prominent */}
        <Card className="border border-border bg-card p-5 space-y-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center">
              <Gavel className="w-3.5 h-3.5 text-foreground/70" />
            </div>
            <h2 className="font-semibold text-sm">{t("result.relevantLaws")}</h2>
          </div>
          <div className="space-y-3">
            {grokResult.relevantLaws.map((law, i) => (
              <div
                key={i}
                className="flex gap-3 p-3 rounded-xl bg-muted/40 border border-border/60 items-start"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                  <Scale className="w-4 h-4 text-foreground/70" />
                </div>
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-sm">{law.name}</p>
                    <Badge variant="outline" className="text-xs">
                      §{law.section}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {law.description}
                  </p>
                  {law.url && (
                    <a
                      href={law.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                    >
                      {t("result.viewOnIndianKanoon")}
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 6. Free legal aid resources */}
        <Card className="border border-border bg-card p-5 space-y-4 mb-6">
          <h2 className="font-semibold text-sm">{t("result.freeLegalAid")}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {legalAidResources.map((resource) => (
              <a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/40 border border-border/60 hover:bg-muted/70 transition-colors group"
              >
                <ExternalLink className="w-3.5 h-3.5 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-medium">{resource.name}</p>
                  <p className="text-xs text-muted-foreground">{resource.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </Card>

        <Separator className="mb-6" />

        <p className="text-xs text-muted-foreground text-center">
          {t("result.disclaimer")}
        </p>
      </div>

      {showLetter && (
        <LetterModal
          analysisId={analysis.id}
          onClose={() => setShowLetter(false)}
          language={analysis.language}
        />
      )}
    </main>
  );
}