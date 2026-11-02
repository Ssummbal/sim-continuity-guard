# SIM Continuity Guard

A frontend prototype for a trust and safety workflow around recycled mobile numbers in Saudi Arabia. It shows how a reassigned number can inherit identity risk from its previous owner, how an AI-style model scores that risk, and how a human reviewer makes the consequential decisions.

The prototype uses Supabase Postgres for persistence. It is built with Next.js App Router, TypeScript, and Tailwind CSS. `stc` is used as the example carrier and all numbers use Saudi mobile formats.

## Run locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
npm run build
npm run start
npm run lint
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page explaining the ghost number problem and the AI/human split |
| `/assess` | Scenario form; runs `assessRisk`, saves a case, and redirects to the case file |
| `/cases/[id]` | Case result: score, level, signals, explanation, and outcome |
| `/queue` | Review queue filtered by level and status, sorted by urgency then age |
| `/queue/[id]` | Reviewer view with approve, reject, and request-more-info actions |
| `/audit` | Audit log of automated clearances and human decisions |

## How risk works

The scoring logic is a pure function in `lib/risk.ts`. The weights and thresholds are declared at the top of that file so they are easy to tune.

| Signal | Maximum points |
| --- | --- |
| Recycled number | 30 |
| Recent SIM swap in the last 30 days | 22 |
| Device changed | 18 |
| Dormancy before reassignment | 20 |
| Linked accounts (banking, wallet, government) | 15 |

The score is the sum of triggered signals, capped at 100.

| Score | Level | Outcome |
| --- | --- | --- |
| 0–29 | Low | Auto-cleared |
| 30–69 | Medium | Sent to human review |
| 70–100 | High | Sent to human review, marked urgent |

Every triggered signal is returned with a plain-English explanation. The case stores the exact signals and score produced at assessment time so later review does not silently recompute history.

## Architecture

Data access is deliberately isolated:

- `lib/types.ts` — shared `Case`, `RiskSignal`, `Decision`, `AuditEntry`, and input types.
- `lib/risk.ts` — pure `assessRisk(input)` scoring function.
- `lib/db.ts` — the only data access surface: `getCases`, `getCaseById`, `createCase`, `updateCaseDecision`, and `getAuditLog`.
- `lib/supabase/database.ts` — typed row and RPC definitions for the Supabase schema.
- `lib/supabase/client.ts` — browser client using the public URL and publishable key.
- `lib/supabase/server.ts` — cookie-based server client for future authenticated reads.
- `lib/supabase/admin.ts` — server-only admin client using the secret key.
- `app/*/page.tsx` — server components by default.
- `components/assess-form.tsx` and `components/decision-form.tsx` — client components only where interaction is needed.
- `app/assess/actions.ts` and `app/queue/[id]/actions.ts` — server actions for form submission.

Pages and components never read the database directly. They call functions from `lib/db.ts`, which reads and writes Supabase using the server-only admin client. Anonymous clients have no table access; authenticated staff have read-only policies for future use.

Because the project enables `cacheComponents`, pages that read data await `connection()` and render dynamic content inside `<Suspense>`. The static shell still renders immediately while the case data streams in.

## Database setup

The app uses Supabase Postgres through the server-only admin client. The browser never talks to the database directly.

1. Create a Supabase project and copy the project URL, publishable key, and secret key into `.env.local`:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   SUPABASE_SECRET_KEY=sb_secret_...
   ```

   `.env*` files are gitignored. Never commit the secret key. Only `NEXT_PUBLIC_*` values are exposed to the browser.

2. Run `supabase/migrations/0001_init.sql` in the Supabase SQL editor. It creates the `cases` and `audit_entries` tables, indexes, row-level security policies, and two transactional functions:

   | Function | Behaviour |
   | --- | --- |
   | `create_case(...)` | Inserts the assessed case and, for low-risk cases, the `auto_cleared` audit entry in one transaction |
   | `decide_case(...)` | Updates a `pending` case and inserts its audit entry in one transaction; raises if the case is missing or already decided |

3. Optionally run `supabase/seed.sql` on a fresh database to load 12 demo cases and their audit entries.

4. Start the app with `npm run dev`.

`lib/db.ts` maps the snake_case rows to the `Case` and `AuditEntry` types. The scoring stays in `lib/risk.ts`; only the resulting score, level, signals, and recommended action are persisted. The admin client bypasses RLS, so the app works before authentication is added; the cookie server client is ready for authenticated reads once a login flow exists.

## Accessibility and design notes

- Risk and status badges always include text; colour is never the only carrier of meaning.
- Forms have labels, inline errors, `aria-invalid`, `aria-describedby`, and a visible error summary.
- The layout includes a skip link, visible focus outlines, and keyboard-operable controls.
- The queue and audit log use responsive table/card layouts.
- Loading skeletons and empty states are provided for data views.

## Known prototype limits

- No authentication flow yet. The app uses the server-only admin client; RLS denies anonymous access and allows authenticated reads for when login is added.
- The reviewer name is editable demo input, not a verified identity.
- No real stc integration or SMS verification.
