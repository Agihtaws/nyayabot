"use client";

import { useState, useEffect } from "react";
import { X, FileText, Copy, Download, Loader2, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Language } from "@/types";
import { useTranslation } from "@/lib/i18n";

interface LetterModalProps {
  analysisId: string;
  onClose: () => void;
  language?: Language;
}

export default function LetterModal({
  analysisId,
  onClose,
  language = "english",
}: LetterModalProps) {
  const t = useTranslation(language);
  const [letter, setLetter] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  useEffect(() => {
    const generate = async () => {
      try {
        const response = await fetch("/api/letter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ analysisId }),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || "Failed to generate letter");
        }

        const { letter } = await response.json();
        setLetter(letter);
      } catch (err: any) {
        setError(err.message || "Failed to generate letter");
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [analysisId]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleCopy = () => {
    if (letter) {
      navigator.clipboard.writeText(letter);
      toast.success(t("letter.toast.copied"));
    }
  };

  const handleDownloadTxt = () => {
    if (!letter) return;
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "legal_reply_letter.txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success(t("letter.toast.downloadedTxt"));
  };

  const handleDownloadPdf = async () => {
    if (!letter) return;
    setDownloadingPdf(true);
    try {
      // jspdf is loaded on demand to keep the main bundle light
      const { jsPDF } = await import("jspdf");

      // Using mm units — A4 is exactly 210mm x 297mm, which avoids
      // pt-based rounding issues that made earlier output look oversized.
      const doc = new jsPDF({ unit: "mm", format: "a4" });

      const pageWidth = 210;
      const pageHeight = 297;
      const marginX = 22;
      const marginTop = 25;
      const marginBottom = 22;
      const maxWidth = pageWidth - marginX * 2;
      const fontSizePt = 11; // standard readable letter size
      const lineHeightMm = 5.6; // ~1.4x line spacing at 11pt

      doc.setFont("times", "normal");
      doc.setFontSize(fontSizePt);

      const paragraphs = letter.split("\n");
      let cursorY = marginTop;

      const addPageIfNeeded = () => {
        if (cursorY > pageHeight - marginBottom) {
          doc.addPage();
          cursorY = marginTop;
        }
      };

      paragraphs.forEach((para) => {
        if (para.trim() === "") {
          cursorY += lineHeightMm * 0.6;
          addPageIfNeeded();
          return;
        }
        const lines = doc.splitTextToSize(para, maxWidth) as string[];
        lines.forEach((line) => {
          addPageIfNeeded();
          doc.text(line, marginX, cursorY);
          cursorY += lineHeightMm;
        });
      });

      doc.save("legal_reply_letter.pdf");
      toast.success(t("letter.toast.downloadedPdf"));
    } catch (err) {
      console.error(err);
      toast.error(t("letter.toast.pdfFailedTitle"), {
        description: t("letter.toast.pdfFailedDesc"),
      });
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-foreground/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm">{t("letter.title")}</p>
              <p className="text-xs text-muted-foreground truncate">
                {t("letter.subtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {loading && (
            <div className="flex flex-col items-center justify-center py-14 sm:py-16 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <div className="text-center space-y-1">
                <p className="text-sm font-medium">{t("letter.drafting")}</p>
                <p className="text-xs text-muted-foreground">
                  {t("letter.draftingSubtext")}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-14 sm:py-16 space-y-2">
              <p className="text-destructive text-sm">{error}</p>
              <button onClick={onClose} className="text-xs text-primary hover:underline">
                {t("letter.closeRetry")}
              </button>
            </div>
          )}

          {letter && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-caution/10 border border-caution/30 text-xs text-caution-foreground">
                {t("letter.warning")}
              </div>
              {/* The letter itself stays in English regardless of UI
                  language — it's a formal document addressed to an
                  authority, landlord, or employer, and English is the
                  safer default for that audience. */}
              <pre className="whitespace-pre-wrap font-serif text-xs sm:text-sm leading-relaxed text-foreground bg-muted/40 rounded-xl p-4 border border-border">
                {letter}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        {letter && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-3.5 sm:p-4 border-t border-border shrink-0">
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1.5 flex-1">
              <Copy className="w-3.5 h-3.5" />
              {t("letter.copy")}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadTxt} className="gap-1.5 flex-1">
              <Download className="w-3.5 h-3.5" />
              {t("letter.downloadTxt")}
            </Button>
            <Button
              size="sm"
              onClick={handleDownloadPdf}
              disabled={downloadingPdf}
              className="gap-1.5 flex-1"
            >
              {downloadingPdf ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5" />
              )}
              {t("letter.downloadPdf")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}