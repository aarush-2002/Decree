# ⚖️ Decree

> **Get What's Owed. Fast.**

[![Live Demo](https://img.shields.io/badge/demo-live-F59E0B?style=for-the-badge&logo=vercel&logoColor=black)](https://decree-woad.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/github-repo-000?style=for-the-badge&logo=github)](https://github.com/aarush-2002/Decree)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Clerk Auth](https://img.shields.io/badge/Auth-Clerk-6463e8?style=for-the-badge&logo=clerk)](https://clerk.com/)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma-2d3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

---

## 📖 The Problem

Indian MSMEs are bleeding capital. **₹10,000+ crores** are stuck in delayed payments every year.

The MSMED Act (Section 16) already gives MSMEs the right to **3× RBI penal interest** on late payments. Yet, less than **15%** actually file claims. Why?

- ❌ **Mathematically complex** — compound interest calculations with annual resting
- ❌ **Legally intimidating** — dense jargon, unclear forms, statutory deadlines
- ⏳ **Time-consuming** — organizing evidence manually
- 💸 **Expensive** — lawyers cost more than the claim itself

MSMEs have the law on their side, but they lack the **tools** to use it.

---

## 💡 The Solution

**Decree** is a pre-filing intelligence platform that turns messy invoices into court-ready legal claims in under 60 seconds.

1. **Upload** any invoice (PDF, JPG, PNG)
2. **Extract** data using a deterministic, human-in-the-loop pipeline
3. **Calculate** exact legal interest under Section 16 of the MSMED Act
4. **Generate** a complete, court-ready filing packet

No lawyers. No confusion. Just results.

---

## 🤖 Why an Agentic Solution?

Processing a commercial invoice isn't a simple database lookup; it requires an autonomous workflow:

| Phase | What Happens |
|-------|-------------|
| **Perceive & Plan** | Ingest unstructured PDF/image invoices and map to statutory legal fields |
| **Retrieve & Compute** | Dynamically fetch RBI rates and apply deterministic legal formulas |
| **Verify & Execute** | Self-evaluate extracted data, prompt human for missing fields (HITL), compile court-ready PDF |

---

## ✨ Key Features

- **Smart Invoice Extraction** — Handles messy real-world documents with human-in-the-loop verification
- **Deterministic Legal Math** — 100% reproducible Section 16 interest calculations with audit trail
- **Court-Ready PDFs** — Auto-generates filing packets with evidence, statutory formulas, and disclaimers
- **Enterprise Security** — Clerk authentication with strict tenant isolation; no IDOR vulnerabilities
- **Neo-Brutalist UI** — Bold, high-contrast, accessibility-first design

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 16 (App Router) | Fast, modern, server components |
| **Language** | TypeScript | Type safety, fewer bugs |
| **Styling** | Tailwind CSS v4 | Rapid development, brutalist design |
| **Backend** | Next.js API Routes | Unified codebase, edge-ready |
| **Database** | PostgreSQL (Neon) | Serverless, scalable, free tier |
| **ORM** | Prisma | Type-safe queries, easy migrations |
| **Auth** | Clerk | Secure, fast integration, tenant isolation |
| **PDF Generation** | `@react-pdf/renderer` | React-based, deterministic output |
| **Deployment** | Vercel | Zero-config, edge network, CI/CD |
| **Animations** | GSAP, Lenis, Framer Motion | Smooth scroll, reveals, micro-interactions |

---

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
```

---

## 📁 Project Structure

```
decree/
├── prisma/                 # Database schema & migrations
├── public/                 # Static assets
├── src/
│   ├── app/                # Next.js App Router (pages + API routes)
│   ├── components/         # React component library (ui, layout, marketing, motion)
│   └── lib/                # Core business logic (rules, validation, auth, rates)
├── middleware.ts           # Clerk auth middleware
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies & scripts
└── README.md               # This file
```

---

## 🗄️ Database Schema

Multi-tenant architecture with organization-level scoping. Every entity belongs to an `Organization`.

### Core Models

| Model | Description |
|-------|-------------|
| **Organization** | Tenant root (msme / ca_firm / law_firm) |
| **User** | Clerk-linked user, belongs to an org |
| **Client** | The MSME entity being represented |
| **Buyer** | The debtor (private / PSU / govt) |
| **Invoice** | Unpaid invoice linking client + buyer |
| **Document** | Uploaded evidence files (PDF/image) |
| **Case** | Legal case per invoice with state machine |
| **CaseEvent** | State transition audit trail |
| **Reminder** | Deadline reminders per case |
| **RbiRateHistory** | RBI rate snapshots for interest calculation |
| **AuditEvent** | Legal-grade traceability (who changed what) |

### Case State Machine

```
draft → awaiting_review → confirmed → demand_sent → filed
                                              → under_proceedings → awarded → recovered
                                                              ↳ rejected
```


---

## 🔑 Core Business Logic

### Section 16 Interest Calculation

**Formula:** Compound interest at 3× RBI bank rate, compounded annually (annual resting):

```
Penal Rate = RBI Bank Rate × 3
Interest accrues daily on current balance
Principal + interest "rests" (compounds) every 365 days
Partial final year accrues pro-rata
```

### Eligibility Gate (Sections 2(b), 15 & 16)

- Buyer must be a covered entity: `private`, `psu`, or `govt`
- Statutory due date must have passed (days overdue > 0)
- Delivery date must not precede invoice date
- Evaluation date must not precede invoice date
- Returns **WHY** (reasons array), not just a boolean

### Rate Resolution

1. Latest row in `RbiRateHistory` effective on/before the "as-of" date (DB = truth)
2. Falls back to `FALLBACK_RBI_BANK_RATE_PERCENT = 5.75` from constants

### Human-in-the-Loop (HITL)

1. Upload page parses a draft from document text (deterministic regexes — no fake AI)
2. User reviews and corrects all fields with confidence indicators
3. Only the confirmed payload is written to the database via `/api/invoices/confirm`
4. Transaction creates: Client (upsert), Buyer, Invoice, Document, Case, CaseEvent, AuditEvent
5. Duplicate-claim guard: same client + invoice number rejected with 409


---

## 🔐 Security & Authentication

- **Clerk** handles authentication with custom-styled appearance
- **Middleware** protects all app pages and API routes (except `/api/rates`)
- **`requireOrg()`** resolves Clerk user → internal DB user → org context; every Prisma query is filtered by `orgId`
- **Fail-closed design:** Unprovisioned users get 404; no cross-tenant data access possible
- **Tenant isolation:** All entities (Invoice, Case, Document, Reminder) are scoped to an organization

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Neon recommended)
- Clerk account

### Installation

```bash
# Clone the repository
git clone https://github.com/aarush-2002/Decree.git
cd Decree

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env  # or create .env manually
```

### Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL="postgresql://user:password@host:port/database"
CLERK_SECRET_KEY="sk_test_..."
CLERK_PUBLISHABLE_KEY="pk_test_..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.


---

## 📡 API Reference

### Public Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/rates` | GET | Current RBI bank rate + history |

### Authenticated Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/cases` | GET | Tenant-scoped case list with accrued interest |
| `/api/claims` | POST | Compute a Section 16 claim (no DB writes) |
| `/api/invoices/confirm` | POST | HITL invoice persistence (creates case + audit trail) |

---

## 📚 Documentation

| File | Description |
|------|-------------|
| `src/README.md` | Overview of the `src/` directory |
| `src/app/README.md` | Pages & API routes reference |
| `src/components/README.md` | Component library reference |
| `src/lib/README.md` | Business logic & utilities reference |
| `prisma/README.md` | Database schema documentation |

Each subdirectory also contains its own `README.md` explaining every file within it.

---

## 🧪 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `postinstall` | `prisma generate` (runs automatically after install) |

---

## ⚖️ Disclaimer

DECREE provides calculation and document-preparation assistance. It is not a law firm and does not provide legal advice or representation. Rates are sourced from RBI publications with as-of dates; verify figures with a qualified advocate before filing.

---

## 📄 License

No license specified. Contact the repository owner for usage permissions.

---

**Built with ❤️ for Indian MSMEs**

