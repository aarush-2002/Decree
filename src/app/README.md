# `src/app/` — Next.js App Router

This directory contains all Next.js App Router pages, layouts, and API route handlers.

## Pages (Server & Client Components)

| Path | Type | Auth | Purpose |
|------|------|------|---------|
| `page.tsx` | Server | Public | Landing page — hero, features, formula, CTA |
| `layout.tsx` | Server | All | Root layout — ClerkProvider, fonts, metadata, preloader |
| `globals.css` | — | All | Design tokens + custom CSS (colors, fonts, animations) |
| `about/page.tsx` | Server | Public | About page — mission, how it works |
| `privacy/page.tsx` | Server | Public | Privacy policy — data collection, storage, rights |
| `terms/page.tsx` | Server | Public | Terms of service — what DECREE is/is not |
| `settings/page.tsx` | Client | Signed In | Account settings — profile, data export/deletion |
| `upload/page.tsx` | Client | Signed In | Invoice upload → extraction → HITL review → confirm |
| `calculator/page.tsx` | Client | Signed In | Interest calculator — standalone computation tool |
| `dashboard/page.tsx` | Client | Signed In | Case dashboard — list, search, filter, sort, stats |
| `case/[id]/page.tsx` | Client | Signed In | Case detail — Overview/Evidence/Calculations tabs + PDF download |
| `case/[id]/packet/page.tsx` | Server | Signed In | Redirects to PDF generation API for this case |

## Auth Pages (`(auth)/`)

| Path | Auth | Purpose |
|------|------|---------|
| `(auth)/layout.tsx` | Public | Shared layout for sign-in/sign-up |
| `(auth)/sign-in/[[...sign-in]]/` | Public | Clerk sign-in page |
| `(auth)/sign-up/[[...sign-up]]/` | Public | Clerk sign-up page |

## API Routes

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `api/cases/route.ts` | GET | Signed In | Tenant-scoped case list with accrued interest |
| `api/claims/route.ts` | POST | Signed In | Compute Section 16 claim (no DB writes) |
| `api/invoices/confirm/route.ts` | POST | Signed In | HITL invoice persistence (creates case + audit trail) |
| `api/rates/route.ts` | GET | Public | Current RBI bank rate + history |

## Middleware

| File | Purpose |
|------|---------|
| `middleware.ts` (root) | Clerk auth middleware — protects pages and API routes |

## File Descriptions

### Pages

- **`page.tsx`** — Marketing landing page with hero section, feature cards, math formula display, and CTA bands. Uses GSAP animations and custom cursor.
- **`layout.tsx`** — Root layout wrapping all pages in `ClerkProvider`, `MotionProvider`, `Preloader`, and `CustomCursor`. Sets page metadata and viewport.
- **`globals.css`** — All design tokens (colors, fonts, radii, shadows), custom animations, and utility styles. Neo-brutalist design system.
- **`about/page.tsx`** — Informational page about DECREE's mission and approach.
- **`privacy/page.tsx`** — Privacy policy explaining data collection, storage, and user rights.
- **`terms/page.tsx`** — Terms of service with disclaimer that DECREE is not a law firm.
- **`settings/page.tsx`** — User settings page for profile management and data export/deletion.
- **`upload/page.tsx`** — File upload flow with dropzone, processing simulation, field review with confidence indicators, and confirm/calculate action.
- **`calculator/page.tsx`** — Interest computation page with input form, results display, formula breakdown, and count-up animations.
- **`dashboard/page.tsx`** — Case management dashboard with data table, search, status filter, sorting, stats cards, and empty/loading/error states.
- **`case/[id]/page.tsx`** — Individual case detail view with tabs for Overview, Evidence, and Calculations, plus sticky sidebar with PDF download.
- **`case/[id]/packet/page.tsx`** — Thin server component that redirects to the PDF generation endpoint for a case.

### API Routes

- **`api/cases/route.ts`** — Fetches all invoices/cases for the authenticated user's organization, computes accrued interest, and returns the list with rate info.
- **`api/claims/route.ts`** — Validates input, computes Section 16 claim eligibility and interest using the shared `claimService`, returns the result without writing to the database.
- **`api/invoices/confirm/route.ts`** — The only write endpoint. Validates confirmed invoice data, checks eligibility, creates Client/Buyer/Invoice/Document/Case/CaseEvent/AuditEvent in a transaction, guards against duplicates.
- **`api/rates/route.ts`** — Public endpoint returning the current RBI bank rate (from DB or fallback) plus rate history.
