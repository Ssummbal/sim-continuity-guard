# SIM Continuity Guard

A frontend prototype for a trust and safety workflow around recycled mobile numbers in Saudi Arabia. It shows how a reassigned number can inherit identity risk from its previous owner, how an AI-style model scores that risk, and how a human reviewer makes the consequential decisions.

The prototype uses mocked, in-memory data. It is built with Next.js App Router, TypeScript, and Tailwind CSS. `stc` is used as the example carrier and all numbers use Saudi mobile formats.

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
- `lib/mock-data.ts` — 12 seeded cases and their audit entries. Imported only by the data layer.
- `lib/db.ts` — the only data access surface: `getCases`, `getCaseById`, `createCase`, `updateCaseDecision`, and `getAuditLog`.
- `app/*/page.tsx` — server components by default.
- `components/assess-form.tsx` and `components/decision-form.tsx` — client components only where interaction is needed.
- `app/assess/actions.ts` and `app/queue/[id]/actions.ts` — server actions for form submission.

Pages and components never read the mock array directly. They call functions from `lib/db.ts`, which currently reads and writes an in-memory store seeded from `lib/mock-data.ts`.

Because the project enables `cacheComponents`, pages that read data await `connection()` and render dynamic content inside `<Suspense>`. The static shell still renders immediately while the case data streams in.

### Mock data behaviour

- 12 realistic cases span low, medium, and high risk, with pending and decided examples.
- The store is seeded lazily on first data access.
- In development, the in-memory store is attached to `globalThis` so hot reloads do not wipe it.
- The data resets whenever the server process restarts.

## Next week: connecting the database

Replace the five functions in `lib/db.ts`. Their signatures are intended to stay the same so pages, components, and server actions do not need to change.

| Function | What the database implementation needs to do |
| --- | --- |
| `getCases(query)` | Select cases, apply optional `level` and `status` filters, map rows to `Case` objects |
| `getCaseById(id)` | Select one case by ID and map it to `Case`, returning `null` if missing |
| `createCase(input)` | Run `assessRisk`, insert the case, and insert an `auto_cleared` audit entry when the level is low |
| `updateCaseDecision(caseId, decision)` | In one transaction: confirm the case is still `pending`, update status and decision fields, then insert the audit entry |
| `getAuditLog()` | Select audit entries newest first and map them to `AuditEntry` |

Suggested steps:

1. Add a Postgres client and migrations (for example Prisma, Drizzle, or `pg`). Put `DATABASE_URL` in `.env.local`.
2. Create `cases` and `audit_entries` tables. Store `signals` and `decision` as `jsonb` to match the current type shape.
3. Keep `lib/mock-data.ts` as a seed script for local development rather than a runtime dependency.
4. Remove the `globalThis` store and the in-memory array from `lib/db.ts`.
5. Make `updateCaseDecision` transactional and enforce the pending-only rule in SQL. Decisions should remain immutable.
6. Keep the existing `revalidatePath` calls in the server actions so the queue, case file, reviewer view, and audit log refresh after a mutation.
7. Replace the demo reviewer name field with the authenticated reviewer from your session when auth is added.

Suggested tables:

```sql
create table cases (
  id text primary key,
  phone_number text not null,
  carrier text not null default 'stc',
  days_inactive integer not null,
  was_recycled boolean not null,
  linked_accounts integer not null,
  recent_sim_swap boolean not null,
  device_changed boolean not null,
  score integer not null,
  level text not null,
  signals jsonb not null,
  recommended_action text not null,
  status text not null,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  decision jsonb
);

create table audit_entries (
  id text primary key,
  case_id text not null references cases(id),
  decision text not null,
  reviewer text not null,
  reason text not null,
  created_at timestamptz not null
);
```

## Accessibility and design notes

- Risk and status badges always include text; colour is never the only carrier of meaning.
- Forms have labels, inline errors, `aria-invalid`, `aria-describedby`, and a visible error summary.
- The layout includes a skip link, visible focus outlines, and keyboard-operable controls.
- The queue and audit log use responsive table/card layouts.
- Loading skeletons and empty states are provided for data views.

## Known prototype limits

- No authentication or authorisation.
- No persistent database; data resets with the server.
- No real stc integration or SMS verification.
- The reviewer name is editable demo input, not a verified identity.
