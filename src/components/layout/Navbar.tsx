"use client";

import { Scale } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Language } from "@/types";
import { useTranslation } from "@/lib/i18n";

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function Navbar({ language, onLanguageChange }: NavbarProps) {
  const t = useTranslation(language);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Scale className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary-foreground" />
          </div>
          <span className="font-serif font-semibold text-base sm:text-lg truncate">
            NyayaBot
          </span>
          <span className="text-xs text-muted-foreground hidden md:block ml-1 truncate">
            {t("nav.tagline")}
          </span>
        </a>

        <Select
          value={language}
          onValueChange={(val) => onLanguageChange(val as Language)}
        >
          <SelectTrigger className="w-[6.5rem] sm:w-32 shrink-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="tamil">தமிழ்</SelectItem>
            <SelectItem value="hindi">हिंदी</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </nav>
  );
}