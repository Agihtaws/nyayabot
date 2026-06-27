"use client";

import { useState } from "react";
import { Scale, FileSearch, Gavel, HeartHandshake } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import UploadSection from "@/components/upload/UploadSection";
import { Language } from "@/types";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const [language, setLanguage] = useState<Language>("english");
  const t = useTranslation(language);

  const steps = [
    {
      icon: FileSearch,
      title: t("home.step1.title"),
      description: t("home.step1.desc"),
    },
    {
      icon: Gavel,
      title: t("home.step2.title"),
      description: t("home.step2.desc"),
    },
    {
      icon: HeartHandshake,
      title: t("home.step3.title"),
      description: t("home.step3.desc"),
    },
  ];

  const documentTypes = [
    t("home.docType.rental"),
    t("home.docType.tax"),
    t("home.docType.termination"),
    t("home.docType.summons"),
    t("home.docType.government"),
    t("home.docType.consumer"),
  ];

  const stats = [
    { value: "40M+", label: t("home.stats.cases") },
    { value: "3", label: t("home.stats.languages") },
    { value: "Free", label: t("home.stats.free") },
  ];

  return (
    <main className="min-h-screen bg-background">
      <Navbar language={language} onLanguageChange={setLanguage} />

      {/* Hero — upload is the hero, not buried below the fold */}
      <section className="pt-16 sm:pt-24 pb-10 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-2.5 sm:space-y-3 mb-5 sm:mb-7">
          <Badge variant="secondary" className="text-xs px-3 py-1">
            {t("home.badge")}
          </Badge>

          <h1 className="text-2xl sm:text-4xl font-serif font-semibold tracking-tight leading-[1.15] text-balance">
            {t("home.heading")}
          </h1>

          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto text-balance">
            {t("home.subheading")}
          </p>
        </div>

        {/* Upload card, with the signature notice-edge on top */}
        <div className="max-w-2xl mx-auto">
          <div className="notice-edge bg-card border border-border rounded-2xl shadow-sm pt-7 pb-6 px-4 sm:px-7">
            <UploadSection language={language} />
          </div>

          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mt-5">
            {documentTypes.map((type) => (
              <Badge key={type} variant="outline" className="text-xs">
                {type}
              </Badge>
            ))}
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground/70 font-medium tracking-wide text-center mt-4">
            உங்கள் உரிமைகளை அறியுங்கள் &nbsp;·&nbsp; अपने अधिकार जानें
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border py-6 px-4 sm:px-6 bg-secondary/40">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 sm:gap-16 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-xl sm:text-2xl font-serif font-semibold text-primary">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-[8rem] sm:max-w-none mx-auto">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-center mb-2">
            {t("home.howItWorks.title")}
          </h2>
          <p className="text-muted-foreground text-center mb-10 sm:mb-12 text-sm sm:text-base">
            {t("home.howItWorks.subtitle")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6">
            {steps.map((step) => (
              <div
                key={step.title}
                className="bg-card border border-border rounded-xl p-5 sm:p-6 space-y-3 sm:space-y-4 h-full"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-serif font-semibold text-base sm:text-lg">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-primary" />
            <span className="font-serif font-semibold">NyayaBot</span>
          </div>
          <p className="text-xs text-muted-foreground max-w-sm">
            {t("home.footer.disclaimer")}
          </p>
          <p className="text-xs text-muted-foreground">{t("home.footer.event")}</p>
        </div>
      </footer>
    </main>
  );
}