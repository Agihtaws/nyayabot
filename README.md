# NyayaBot — AI Legal Aid for Everyone

> Upload any legal notice. Understand your rights. Fight back.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-gold?style=for-the-badge)](YOUR_LIVE_URL_HERE)
[![GitHub](https://img.shields.io/badge/GitHub-View%20Code-black?style=for-the-badge&logo=github)](YOUR_GITHUB_URL_HERE)
[![YouTube](https://img.shields.io/badge/YouTube-Watch%20Demo-red?style=for-the-badge&logo=youtube)](YOUR_YOUTUBE_URL_HERE)

![NyayaBot Screenshot](YOUR_SCREENSHOT_URL_HERE)

---

## The Problem

India has over 40 million pending court cases. Most ordinary citizens — tenants, workers, consumers — receive legal notices they cannot understand. They cannot afford lawyers for basic disputes. They do not know their rights. So they comply, overpay, or simply give up.

NyayaBot exists to change that.

---

## What Is NyayaBot?

NyayaBot is a multi-agent AI legal aid web application for Indian citizens. Upload any legal document — a rental eviction notice, an income tax demand, a termination letter, a court summons — and three AI agents analyze it in parallel, identify your legal rights under Indian law, and explain exactly what to do next. In Tamil, Hindi, or English.

---

## Demo

[![Watch Demo Video](https://img.shields.io/badge/Watch%20Demo-YouTube-red?style=for-the-badge&logo=youtube)](YOUR_YOUTUBE_URL_HERE)

---

## How It Works

NyayaBot uses a three-agent parallel AI architecture. Each agent has a specific role:

| Agent | Model | Role |
|---|---|---|
| Document Analyst | Gemini 2.5 Flash | Reads the document, identifies document type, extracts key findings and problematic clauses |
| Legal Researcher | Groq / Llama 3.3 70B | Fetches relevant Indian acts, specific section numbers, and applicable court judgments |
| Rights Synthesizer | Mistral Small | Combines both outputs into a plain-language rights explanation and action steps |

After all three agents complete, the orchestrator translates the **entire AI output** into the user's selected language using Gemini 2.5 Flash — every finding, law description, right, next step, and summary. The full application UI is also translated end-to-end via a centralized i18n system.

---

## Features

- **Multi-format document input** — Upload PDF, photo of a notice, or paste text directly
- **Three AI agents working in parallel** — Gemini, Groq/Llama, and Mistral each play a defined role
- **Live agent progress screen** — Watch all three agents work in real time during analysis
- **Full end-to-end multilingual experience** — Every screen, label, button, toast, and AI output translated to Tamil, Hindi, or English via a centralized i18n dictionary (107 unique translation keys)
- **Plain language explanation** — What the document means in simple everyday language
- **Your rights, clearly listed** — Specific legal rights under Indian law for your situation
- **Step-by-step next actions** — Exactly what to do, in order, without legal jargon
- **Relevant Indian laws** — Specific acts and section numbers with Indian Kanoon links
- **Generate Response Letter** — One click drafts a professional English legal reply letter you can actually send to an authority or landlord
- **Document-aware follow-up chat** — Suggested questions adapt to the type of document analyzed; all chat UI is translated per language
- **Free legal aid resources** — Direct links to NALSA, eCourts, Indian Kanoon, and Tamil Nadu state authority
- **Mobile responsive** — Works on any device

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, Tailwind CSS v4, shadcn/ui |
| Backend | Next.js API Routes |
| Database | Supabase (PostgreSQL + pgvector) |
| File Storage | Supabase Storage |
| PDF Parsing | unpdf |
| Image OCR | Tesseract.js with Gemini 2.5 Flash fallback |
| AI — Document Analysis | Google Gemini 2.5 Flash |
| AI — Legal Research | Groq API (Llama 3.3 70B Versatile) |
| AI — Rights Synthesis | Mistral Small |
| AI — Full Output Translation | Google Gemini 2.5 Flash |
| Internationalisation | Custom i18n system (src/lib/i18n.ts) |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A Supabase account (free tier is sufficient)
- API keys for Gemini, Groq, and Mistral

### Installation

```bash
# Clone the repository
git clone YOUR_GITHUB_URL_HERE
cd nyayabot

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Fill in your `.env.local` file:

```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
MISTRAL_API_KEY=your_mistral_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Supabase Setup

Run this SQL in your Supabase SQL editor:

```sql
create extension if not exists vector;

create table documents (
  id uuid default gen_random_uuid() primary key,
  file_name text not null,
  file_type text not null,
  raw_text text not null,
  storage_url text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

create table analyses (
  id uuid default gen_random_uuid() primary key,
  document_id uuid references documents(id) on delete cascade,
  gemini_result jsonb,
  grok_result jsonb,
  mistral_result jsonb,
  final_summary text,
  language text default 'english',
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

Then go to **Storage → New Bucket → Name: `legal-docs` → Toggle Public ON → Create**.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Translation & Internationalisation

NyayaBot has full end-to-end language support for English, Tamil, and Hindi.

### AI Output Translation

When Tamil or Hindi is selected, all AI-generated content is translated before being saved to the database:

| Agent Output | Fields Translated |
|---|---|
| Gemini | Document summary, all findings, all problematic clauses |
| Groq / Llama | Legal summary, all law descriptions, recent judgments |
| Mistral | What this means, all rights, all next steps |

Law names, section numbers, proper nouns, and currency amounts are preserved in English as per standard Indian legal convention.

### UI Translation

All static UI text is managed through a centralized dictionary at `src/lib/i18n.ts` with 107 unique translation keys covering every screen in the application:

| Screen | Translated |
|---|---|
| Landing page — hero, steps, stats, badges | ✅ |
| Navbar — tagline, language selector | ✅ |
| Upload section — labels, hints, badges, toasts, button | ✅ |
| Analyzing screen — agent names, status text, step descriptions | ✅ |
| Results page — all headers, badges, section titles, buttons, disclaimer | ✅ |
| Chat section — UI labels, suggested questions (document-type aware) | ✅ |
| Letter modal — UI chrome, warning text, action buttons | ✅ |

### Response Letter

The AI-generated response letter intentionally remains in English regardless of language selection. Legal reply letters addressed to landlords, government authorities, or courts in India are formally submitted in English. Translating them would reduce their legal effectiveness.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/      # Orchestrates three agents + full AI translation
│   │   ├── chat/         # Follow-up question chat endpoint
│   │   ├── letter/       # Response letter generation (English output)
│   │   └── parse/        # PDF and image parsing endpoint
│   ├── analyzing/[id]/   # Live agent progress screen (fully translated)
│   ├── result/[id]/      # Full analysis results page (fully translated)
│   └── page.tsx          # Landing page (fully translated)
├── components/
│   ├── layout/
│   │   └── Navbar.tsx    # Navbar with language selector (translated)
│   ├── results/
│   │   ├── ChatSection.tsx     # Follow-up chat with doc-aware suggestions (translated)
│   │   └── LetterModal.tsx     # Response letter modal (UI translated, letter in English)
│   └── upload/
│       └── UploadSection.tsx   # Upload tabs with full translation
├── lib/
│   ├── agents/
│   │   ├── geminiAgent.ts      # Document analysis agent
│   │   ├── grokAgent.ts        # Legal research agent (Groq/Llama)
│   │   └── mistralAgent.ts     # Rights synthesis agent
│   ├── parsers/
│   │   ├── pdfParser.ts        # PDF text extraction (unpdf)
│   │   └── imageParser.ts      # Image OCR (Tesseract + Gemini fallback)
│   ├── supabase/
│   │   ├── client.ts           # Browser client
│   │   └── server.ts           # Server admin client
│   ├── i18n.ts                 # Centralized i18n dictionary (~150 entries, 3 languages)
│   ├── processSteps.ts         # Agent step definitions (i18n-aware)
│   └── utils/
│       └── translate.ts        # Full AI output translation utility
└── types/
    └── index.ts                # TypeScript type definitions
```

---

## Supported Document Types

- Rental eviction notices
- Income tax demand notices
- Employment termination letters
- Court summons
- Consumer complaint responses
- Government notices
- Any other Indian legal document (PDF, image, or plain text)

---

## Limitations

- NyayaBot provides AI-generated information only. It is not a substitute for professional legal advice.
- OCR accuracy depends on image quality. Clear scans or typed PDFs produce the best results.
- Legal information is based on general Indian law. State-specific regulations may vary.
- For serious legal matters, always consult a qualified advocate or visit your nearest District Legal Services Authority (DLSA).

---

## Built For

**Youth Code x AI 2026 Hackathon**
Track 03 — AI That Actually Helps People

---

## License

MIT License — free to use, modify, and distribute.

---

*NyayaBot — Because everyone deserves to understand their rights.*