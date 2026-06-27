import { FileSearch, Gavel, HeartHandshake, LucideIcon } from "lucide-react";
import { DictionaryKey } from "@/lib/i18n";

export interface ProcessStep {
  key: string;
  titleKey: DictionaryKey;
  subtitleKey: DictionaryKey;
  taskKey: DictionaryKey;
  icon: LucideIcon;
}

// User-facing process steps. Deliberately role-based, not model-based —
// people trust "what was checked", not which AI vendor checked it.
// (Model names — Gemini / Groq+Llama / Mistral — stay in code & README only.)
// Text is referenced via i18n dictionary keys so it can render in
// English, Tamil, or Hindi depending on the selected language.
export const PROCESS_STEPS: ProcessStep[] = [
  {
    key: "reading",
    titleKey: "analyzing.step1.title",
    subtitleKey: "analyzing.step1.subtitle",
    taskKey: "analyzing.step1.task",
    icon: FileSearch,
  },
  {
    key: "researching",
    titleKey: "analyzing.step2.title",
    subtitleKey: "analyzing.step2.subtitle",
    taskKey: "analyzing.step2.task",
    icon: Gavel,
  },
  {
    key: "rights",
    titleKey: "analyzing.step3.title",
    subtitleKey: "analyzing.step3.subtitle",
    taskKey: "analyzing.step3.task",
    icon: HeartHandshake,
  },
];