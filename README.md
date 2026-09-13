# ⚖️ DECREE

> **Get What's Owed. Fast.**

[![Live Demo](https://img.shields.io/badge/demo-live-F59E0B?style=for-the-badge&logo=vercel&logoColor=black)](https://decree-omega.vercel.app)
[![GitHub](https://img.shields.io/badge/github-repo-000?style=for-the-badge&logo=github)](https://github.com/aarush-2002/Decree)
[![Built by Devansh Mishra](https://img.shields.io/badge/built_by-Devansh_Mishra-111?style=for-the-badge)](https://github.com/aarush-2002/Decree)

---

## 📖 The Problem

Indian MSMEs are bleeding capital. **₹10,000+ crores** are stuck in delayed payments every year. 

The MSMED Act (Section 16) already gives MSMEs the right to **3x RBI penal interest** on late payments. Yet, less than **15%** actually file claims. Why?

Because the legal process is:
- ❌ **Mathematically complex** (compound interest calculations).
- ❌ **Legally intimidating** (dense jargon, unclear forms).
- ⏳ **Time-consuming** (organizing evidence manually).
- 💸 **Expensive** (lawyers cost more than the claim itself).

MSMEs have the law on their side, but they lack the **tools** to use it.

## 💡 The Solution

**Decree** is a pre-filing intelligence platform that turns messy invoices into court-ready legal claims in under 60 seconds.

1. **Upload** any invoice (PDF, JPG, PNG).
2. **Extract** data using our smart agentic pipeline.
3. **Calculate** exact legal interest under Section 16 of the MSMED Act.
4. **Generate** a complete, court-ready filing packet.

No lawyers. No confusion. Just results.

## 🤖 Why an Agentic Solution?

Processing a commercial invoice isn't a simple database lookup; it requires an autonomous workflow. We built Decree as an agent because it needs to:

1. **Perceive & Plan:** Ingest unstructured, messy PDF/image invoices and map them to statutory legal fields.
2. **Retrieve & Compute:** Dynamically fetch current RBI rates and apply deterministic legal formulas without hallucinations.
3. **Verify & Execute:** Self-evaluate the extracted data, prompt the human for missing fields (Human-in-the-Loop), and autonomously compile the final court-ready PDF packet.

## ✨ Key Features

- **Smart Invoice Extraction:** Handles messy, real-world documents with a human-in-the-loop verification step.
- **Deterministic Legal Math:** Applies Section 16 of the MSMED Act with 100% reproducible, legally defensible calculations.
- **Court-Ready PDFs:** Auto-generates filing packets containing evidence, statutory formulas, and legal disclaimers.
- **Enterprise Security:** Clerk authentication with strict tenant isolation. No IDOR vulnerabilities.
- **Neo-Brutalist UI:** Bold, high-contrast, accessibility-first design.

## 🛠️ Tech Stack

| Layer | Technology | Why? |
|-------|-----------|------|
| **Frontend** | Next.js 16 (App Router) | Fast, modern, server components |
| **Language** | TypeScript | Type safety, fewer bugs |
| **Styling** | Tailwind CSS | Rapid development, brutalist design |
| **Backend** | Next.js API Routes | Unified codebase, edge-ready |
| **Database** | PostgreSQL (Neon) | Serverless, scalable, free tier |
| **ORM** | Prisma | Type-safe queries, easy migrations |
| **Auth** | Clerk | Secure, fast integration, tenant isolation |
| **PDF Gen** | @react-pdf/renderer | React-based, deterministic output |
| **Deployment** | Vercel | Zero-config, edge network, CI/CD |

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                    HUMAN INTERACTION                        │
│                    (MSME User)                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  NEXT.JS FRONTEND                           │
│            (UI / React Components / State)                  │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│               AGENT CONTROLLER (API)                        │
│         (Next.js API Routes / Orchestration)                │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Planning   │→ │  Execution  │→ │ Verification│        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────┬────────────┬────────────┬────────────┬──────────┘
          │            │            │            │
          ▼            ▼            ▼            ▼
    ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
    │ MEMORY  │  │RETRIEVAL│  │  TOOLS  │  │EXTERNAL │
    │  (DB)   │  │ (Rules) │  │ (PDF)   │  │(Clerk)  │
    └─────────┘  └─────────┘  └─────────┘  └─────────┘
