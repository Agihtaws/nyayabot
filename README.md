# ![NyayaBot](YOUR_SCREENSHOT_URL_HERE)

# NyayaBot — AI Legal Aid for Everyone

> Upload any legal notice. Understand your rights. Fight back.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-gold?style=for-the-badge)](YOUR_LIVE_URL_HERE)
[![GitHub](https://img.shields.io/badge/GitHub-View%20Code-black?style=for-the-badge&logo=github)](YOUR_GITHUB_URL_HERE)
[![YouTube](https://img.shields.io/badge/YouTube-Watch%20Demo-red?style=for-the-badge&logo=youtube)](YOUR_YOUTUBE_URL_HERE)

---

## The Problem

India has over 40 million pending court cases. Most ordinary citizens — tenants, workers, consumers — receive legal notices they cannot understand. They cannot afford lawyers for basic disputes. They do not know their rights. So they comply, overpay, or simply give up.

NyayaBot exists to change that.

---

## What Is NyayaBot?

NyayaBot is a multi-agent AI legal aid web application for Indian citizens. Upload any legal document — a rental eviction notice, an income tax demand, a termination letter, a court summons — and three AI agents analyze it simultaneously, identify your legal rights under Indian law, and explain exactly what to do next. In Tamil, Hindi, or English.

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
| Rights Synthesizer | Mistral Small | Combines both outputs into plain-language rights explanation and action steps |

The orchestrator runs all three agents, then translates the final output into the user's selected language using Gemini Vision.

---

## Features

- **Multi-format document input** — Upload PDF, photo of a notice, or paste text directly
- **Three AI agents in parallel** — Gemini, Groq/Llama, and Mistral each play a defined role
- **Live agent progress screen** — Watch all three agents work in real time during analysis
- **Plain language explanation** — What the document means in simple everyday language
- **Your rights, clearly listed** — Specific legal rights under Indian law for your situation
- **Step-by-step next actions** — Exactly what to do, in order, without legal jargon
- **Relevant Indian laws** — Specific acts and section numbers with Indian Kanoon links
- **Generate Response Letter** — One click to draft a professional legal reply you can actually send
- **Follow-up chat** — Ask any follow-up question about your document and get contextual answers
- **Multilingual output** — Tamil, Hindi, or English
- **Free legal aid resources** — Direct links to NALSA, eCourts, Indian Kanoon, and state authorities
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
| Image OCR | Tesseract.js with Gemini Vision fallback |
| AI — Document Analysis | Google Gemini 2.5 Flash |
| AI — Legal Research | Groq API (Llama 3.3 70B Versatile) |
| AI — Rights Synthesis | Mistral Small |
| AI — Translation | Google Gemini 2.5 Flash |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- A Supabase account (free tier)
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

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
MISTRAL_API_KEY=your_mistral_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Supabase Setup

Run the following SQL in your Supabase SQL editor:

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

Then go to **Storage → New Bucket → Name: `legal-docs` → Public: ON**.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/      # Orchestrates three AI agents
│   │   ├── chat/         # Follow-up question chat
│   │   ├── letter/       # Response letter generation
│   │   └── parse/        # PDF and image parsing
│   ├── analyzing/[id]/   # Live agent progress screen
│   ├── result/[id]/      # Full analysis results page
│   └── page.tsx          # Landing page and upload
├── components/
│   ├── layout/           # Navbar
│   ├── results/          # Chat and letter modal
│   └── upload/           # Upload section with tabs
├── lib/
│   ├── agents/           # Gemini, Groq, Mistral agent logic
│   ├── parsers/          # PDF and image parsers
│   ├── supabase/         # Client and server instances
│   └── utils/            # Translation utility
└── types/                # TypeScript type definitions
```

---

## Supported Document Types

- Rental eviction notices
- Income tax demand notices
- Employment termination letters
- Court summons
- Consumer complaint responses
- Government notices
- Any other Indian legal document

---

## Limitations

- NyayaBot provides AI-generated information only. It is not a substitute for professional legal advice.
- OCR accuracy depends on image quality. Clear scans or typed PDFs produce best results.
- Legal information is based on general Indian law. State-specific regulations may vary.
- For serious legal matters, always consult a qualified advocate.

---

## Built For

**Youth Code x AI 2026 Hackathon**
Track 03 — AI That Actually Helps People

---

## License

MIT License — free to use, modify, and distribute.

---
