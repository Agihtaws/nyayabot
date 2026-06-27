"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Scale, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PROCESS_STEPS } from "@/lib/processSteps";
import { useTranslation } from "@/lib/i18n";
import { Language } from "@/types";

type StepStatus = "waiting" | "active" | "done";

// Each step is given this much minimum on-screen time before advancing,
// regardless of how fast the real API call finishes. This keeps the
// progress feel honest and visible instead of racing the network and
// jumping straight from step 1 to "all done". Spaced out a bit more
// since translation adds a real extra step to the backend pipeline.
const MIN_STEP_DURATION_MS = 3000;
// If we're still waiting well past the typical duration, show a
// reassuring note instead of letting the user wonder if it's frozen.
const SLOW_NOTICE_MS = 18000;

export default function AnalyzingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const language = (searchParams.get("lang") || "english") as Language;
  const t = useTranslation(language);

  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [slowRunning, setSlowRunning] = useState(false);
  const calledRef = useRef(false);

  const getStatus = (index: number): StepStatus => {
    if (done) return "done";
    if (index < currentStep) return "done";
    if (index === currentStep) return "active";
    return "waiting";
  };

  useEffect(() => {
    const docId = String(params.id);
    const dedupKey = `nyayabot-analyzing-${docId}`;

    // A useRef alone resets on every dev-mode Fast Refresh remount, which
    // would silently kick off a second /api/analyze call. sessionStorage
    // survives remounts within the same tab, so we use it to track whether
    // this specific document's API call has already been started.
    const existing = typeof window !== "undefined" ? sessionStorage.getItem(dedupKey) : null;

    if (existing && existing.startsWith("done:")) {
      // A previous mount already finished this analysis — go straight there.
      const finishedAnalysisId = existing.slice("done:".length);
      router.replace(`/result/${finishedAnalysisId}`);
      return;
    }

    let isMounted = true;
    let cancelled = false;
    const stepTimers: ReturnType<typeof setTimeout>[] = [];
    let pollIntervalId: ReturnType<typeof setInterval> | null = null;

    // IMPORTANT: step progress timers run on every mount, regardless of
    // whether this mount is the one that owns the API call. Skipping them
    // for a "remounted" instance (e.g. after Fast Refresh) was the actual
    // bug — it left the UI frozen on step 1 with no visual progress at all
    // while an earlier, orphaned mount's API call ran in the background.
    stepTimers.push(setTimeout(() => !cancelled && setCurrentStep(1), MIN_STEP_DURATION_MS));
    stepTimers.push(setTimeout(() => !cancelled && setCurrentStep(2), MIN_STEP_DURATION_MS * 2));
    stepTimers.push(setTimeout(() => !cancelled && setSlowRunning(true), SLOW_NOTICE_MS));

    const analyzeStartedAt = Date.now();

    const finish = (analysisId: string) => {
      if (typeof window !== "undefined") {
        sessionStorage.setItem(dedupKey, `done:${analysisId}`);
      }
      if (isMounted) {
        setCurrentStep(3);
        setDone(true);
      }
      setTimeout(() => {
        router.push(`/result/${analysisId}`);
      }, 900);
    };

    const alreadyInFlight = Boolean(existing) || calledRef.current;

    if (!alreadyInFlight) {
      // This mount owns the actual API call.
      calledRef.current = true;
      if (typeof window !== "undefined") sessionStorage.setItem(dedupKey, "in-progress");

      const analyze = async () => {
        try {
          const response = await fetch("/api/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ documentId: params.id, language }),
          });

          if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || "Analysis failed");
          }

          const { analysisId } = await response.json();

          // Make sure the last step gets at least its minimum visible
          // time too, even if the API already finished by now.
          const elapsed = Date.now() - analyzeStartedAt;
          const remaining = Math.max(0, MIN_STEP_DURATION_MS * 3 - elapsed);

          setTimeout(() => finish(analysisId), remaining);
        } catch (err: any) {
          if (typeof window !== "undefined") sessionStorage.removeItem(dedupKey);
          if (!cancelled) {
            setError(err.message || "Analysis failed. Please try again.");
          }
        }
      };

      analyze();
    } else {
      // A previous mount already started the API call (most likely due
      // to a dev-mode Fast Refresh remount). This mount doesn't call the
      // API again — it just watches sessionStorage so it can pick up the
      // result and navigate once the original call finishes, while still
      // showing normal step progress in the meantime instead of freezing.
      const pollInterval = setInterval(() => {
        if (typeof window === "undefined") return;
        const latest = sessionStorage.getItem(dedupKey);
        if (latest && latest.startsWith("done:")) {
          if (pollIntervalId) clearInterval(pollIntervalId);
          const finishedAnalysisId = latest.slice("done:".length);
          if (isMounted) {
            setCurrentStep(3);
            setDone(true);
          }
          setTimeout(() => router.push(`/result/${finishedAnalysisId}`), 600);
        }
      }, 500);
      pollIntervalId = pollInterval;
    }

    return () => {
      isMounted = false;
      cancelled = true;
      stepTimers.forEach(clearTimeout);
      if (pollIntervalId) clearInterval(pollIntervalId);
    };
  }, []);

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8 sm:mb-10">
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary flex items-center justify-center">
          <Scale className="w-4 h-4 text-primary-foreground" />
        </div>
        <span className="font-serif font-semibold text-lg">NyayaBot</span>
      </div>

      <div className="w-full max-w-md space-y-4">
        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-xl sm:text-2xl font-serif font-semibold">
            {done ? t("analyzing.titleDone") : t("analyzing.title")}
          </h1>
          <p className="text-muted-foreground text-sm">
            {done
              ? t("analyzing.subtitleDone")
              : slowRunning
              ? t("analyzing.subtitleSlow")
              : t("analyzing.subtitleNormal")}
          </p>
        </div>

        {/* Process Steps */}
        <div className="space-y-3">
          {PROCESS_STEPS.map((step, index) => {
            const status = getStatus(index);
            const Icon = step.icon;
            const title = t(step.titleKey);
            const subtitle = t(step.subtitleKey);
            const task = t(step.taskKey);

            return (
              <Card
                key={step.key}
                className={`p-4 border transition-all duration-700 ${
                  status === "active"
                    ? "border-primary/50 shadow-md"
                    : status === "done"
                    ? "border-rights/40"
                    : "border-border opacity-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500 ${
                      status === "done"
                        ? "bg-rights/10"
                        : status === "active"
                        ? "bg-primary/10"
                        : "bg-muted"
                    }`}
                  >
                    {status === "done" ? (
                      <CheckCircle className="w-5 h-5 text-rights" />
                    ) : status === "active" ? (
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    ) : (
                      <Icon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-sm">{title}</p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                          status === "done"
                            ? "bg-rights/10 text-rights"
                            : status === "active"
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {status === "done"
                          ? t("analyzing.status.done")
                          : status === "active"
                          ? t("analyzing.status.working")
                          : t("analyzing.status.waiting")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {status === "active"
                        ? task
                        : status === "done"
                        ? `${subtitle} ${t("analyzing.complete")}`
                        : subtitle}
                    </p>
                  </div>
                </div>

                {status === "active" && (
                  <div className="mt-3 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full animate-pulse"
                      style={{ width: "65%" }}
                    />
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {error && (
          <Card className="p-4 border border-destructive/30 bg-destructive/5 flex items-start gap-3 mt-4">
            <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-destructive">
                {t("analyzing.error.title")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{error}</p>
              <button
                onClick={() => router.push("/")}
                className="text-xs text-primary mt-2 hover:underline"
              >
                {t("analyzing.error.retry")}
              </button>
            </div>
          </Card>
        )}
      </div>
    </main>
  );
}