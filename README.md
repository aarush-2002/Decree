# ⚖️ Decree: The Evidence-to-Claim Layer for MSMEs

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2d3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql)

> Decree converts messy commercial evidence into an auditable, evidence-backed, continuously tracked delayed-payment claim. It is the **pre-filing intelligence layer** for India's MSME ecosystem.

---

## 🚨 The Problem & Differentiation (vs. SAMADHAAN)
The Government of India already provides **MSME SAMADHAAN** for filing and monitoring delayed payments. So why Decree? 

SAMADHAAN is a *filing portal*. It assumes the user already has a perfectly organized, legally sound claim package. In reality, MSMEs struggle with:
1. **Messy Evidence**: Invoices are blurry, multi-page, or lack explicit acceptance dates.
2. **Complex Math**: Calculating exact penal interest (3× RBI rate) under Section 16 of the MSMED Act, 2006, across month boundaries and partial payments is error-prone.
3. **Missing Documentation**: Filing gets rejected because delivery proof or Udyam registration is missing.

**Decree's Value Proposition**: We do not replace SAMADHAAN. We are the **pre-filing intelligence engine** that ingests messy documents, extracts and validates evidence, deterministically calculates legal eligibility, flags missing evidence, and generates a court-ready claim package *before* the user ever touches the government portal.

---

## 🏗️ System Architecture

```mermaid
graph TD
    A[User Uploads Invoice PDF/Image] --> B(Uploadthing Secure Storage)
    B --> C{Next.js API Route}
    C -->|Auth Check| D[Clerk Authentication]
    C -->|Tenant Scope| E[Prisma ORM]
    E --> F[(Neon PostgreSQL)]
    C --> G[Deterministic Rules Engine]
    G -->|MSMED Act Sec 15-24 Logic| H[Interest & Eligibility Calculator]
    H --> I[@react-pdf/renderer]
    I --> J[Downloadable Filing Packet PDF]