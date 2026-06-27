"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Send, Loader2, Bot, User } from "lucide-react";
import { DocumentType, Language } from "@/types";
import { useTranslation, DictionaryKey } from "@/lib/i18n";

interface Message {
  role: "user" | "assistant";
  content: string;
}

// Suggested questions tailored to the kind of document that was actually
// uploaded, instead of one fixed rental-eviction-flavored list shown for
// every document type (which made no sense for a tax notice, termination
// letter, court summons, etc). Keys resolve through the i18n dictionary
// so they render in the document's selected language.
const QUESTION_KEYS_BY_DOC_TYPE: Record<DocumentType, DictionaryKey[]> = {
  rental_notice: ["suggest.rental.q1", "suggest.rental.q2", "suggest.rental.q3", "suggest.rental.q4"],
  tax_notice: ["suggest.tax.q1", "suggest.tax.q2", "suggest.tax.q3", "suggest.tax.q4"],
  termination_letter: [
    "suggest.termination.q1",
    "suggest.termination.q2",
    "suggest.termination.q3",
    "suggest.termination.q4",
  ],
  court_summons: ["suggest.summons.q1", "suggest.summons.q2", "suggest.summons.q3", "suggest.summons.q4"],
  consumer_complaint: [
    "suggest.consumer.q1",
    "suggest.consumer.q2",
    "suggest.consumer.q3",
    "suggest.consumer.q4",
  ],
  government_notice: [
    "suggest.government.q1",
    "suggest.government.q2",
    "suggest.government.q3",
    "suggest.government.q4",
  ],
  unknown: ["suggest.unknown.q1", "suggest.unknown.q2", "suggest.unknown.q3", "suggest.unknown.q4"],
};

interface ChatSectionProps {
  analysisId: string;
  documentType?: DocumentType;
  language?: Language;
}

export default function ChatSection({
  analysisId,
  documentType,
  language = "english",
}: ChatSectionProps) {
  const t = useTranslation(language);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = (
    QUESTION_KEYS_BY_DOC_TYPE[documentType ?? "unknown"] ?? QUESTION_KEYS_BY_DOC_TYPE.unknown
  ).map((key) => t(key));

  // Scroll only the inner chat message list, never the page itself.
  // (scrollIntoView() on a nested ref can drag the whole page scroll
  // position along with it, which is what was causing the page to
  // jump down every time a message or answer arrived.)
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendMessage = async (question: string) => {
    if (!question.trim() || loading) return;

    const userMessage: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analysisId,
          question,
          history: messages.slice(-6),
        }),
      });

      if (!response.ok) throw new Error("Failed to get answer");

      const { answer } = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: t("chat.error"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-primary/25 bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 sm:p-5 border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
          <MessageCircle className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <h2 className="font-semibold text-sm">{t("chat.title")}</h2>
          <p className="text-xs text-muted-foreground">{t("chat.subtitle")}</p>
        </div>
      </div>

      {/* Suggested Questions */}
      {messages.length === 0 && (
        <div className="p-4 border-b border-border">
          <p className="text-xs text-muted-foreground mb-3">{t("chat.tryAsking")}</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q) => (
              <button
                key={q}
                onClick={() => sendMessage(q)}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-muted/40 hover:bg-muted/70 hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground text-left"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div ref={scrollContainerRef} className="max-h-80 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 sm:gap-3 items-start ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  msg.role === "user" ? "bg-primary/15" : "bg-muted"
                }`}
              >
                {msg.role === "user" ? (
                  <User className="w-3 h-3 text-primary" />
                ) : (
                  <Bot className="w-3 h-3 text-muted-foreground" />
                )}
              </div>
              <div
                className={`max-w-[82%] sm:max-w-[80%] rounded-2xl px-3.5 sm:px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted/60 text-foreground rounded-tl-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 items-start">
              <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                <Bot className="w-3 h-3 text-muted-foreground" />
              </div>
              <div className="bg-muted/60 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="p-3 sm:p-4 border-t border-border flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          placeholder={t("chat.inputPlaceholder")}
          className="flex-1 min-w-0 bg-muted/40 border border-border rounded-xl px-3.5 sm:px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-colors placeholder:text-muted-foreground"
          disabled={loading}
        />
        <Button
          size="sm"
          onClick={() => sendMessage(input)}
          disabled={!input.trim() || loading}
          className="w-9 h-9 p-0 rounded-xl shrink-0"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5" />
          )}
        </Button>
      </div>
    </Card>
  );
}