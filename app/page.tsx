import Link from "next/link";
import { RiskBadge, UrgentBadge } from "@/components/badges";
import { ScoreRing } from "@/components/score-ring";

const problemSteps = [
  {
    number: "01",
    title: "The number is withdrawn",
    description:
      "After a long dormancy, a carrier may reclaim and reassign a mobile number to a new subscriber.",
  },
  {
    number: "02",
    title: "Old links remain",
    description:
      "Banking, wallet, and government accounts often stay anchored to the old number long after the original owner leaves.",
  },
  {
    number: "03",
    title: "Exposure opens",
    description:
      "The new holder can receive verification codes and recovery messages meant for someone else. That is the ghost number problem.",
  },
];

const modelSteps = [
  "Validates the Saudi mobile number and normalises the signal set.",
  "Applies a fixed weighted model and returns a score from 0 to 100.",
  "Explains every triggered signal in plain English for the reviewer.",
];

const reviewerSteps = [
  "Reads the signals, not just the score.",
  "Approves, rejects, or requests more information.",
  "Records a written reason that is attached to the audit trail.",
];

const exampleSignals = [
  { label: "Recycled number", points: "+30" },
  { label: "Recent SIM swap", points: "+22" },
  { label: "Device changed", points: "+18" },
  { label: "200 days dormant", points: "+12" },
];

export default function HomePage() {
  return (
    <main id="content">
      <section className="relative overflow-hidden border-b border-line bg-surface">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,var(--accent-soft),transparent_48%)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid w-full max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div>
            <p className="inline-flex flex-wrap items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[11px] font-semibold text-muted">
              <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
              Trust &amp; Safety prototype · Saudi Arabia · stc example
            </p>
            <h1 className="mt-6 max-w-2xl font-serif text-4xl font-semibold leading-[1.06] tracking-tight sm:text-6xl">
              A recycled number should not inherit someone else&apos;s
              identity.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              When a mobile number is reassigned, the previous owner&apos;s
              banking, wallet, and government accounts may still be reachable
              through it. SIM Continuity Guard scores that continuity risk,
              then hands the consequential decision to a human reviewer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/assess" className="btn-primary">
                Run an assessment
                <span aria-hidden="true">→</span>
              </Link>
              <Link href="/queue" className="btn-secondary">
                Open the review queue
              </Link>
            </div>
            <p className="mt-5 text-sm text-muted">
              AI scores every signal. A named person makes the call.
            </p>
          </div>

          <aside aria-label="Illustrative case example" className="relative">
            <div
              className="absolute -inset-3 rounded-[1.6rem] border border-accent/10 bg-accent-soft/60"
              aria-hidden="true"
            />
            <div className="card relative p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow">Illustrative assessment</p>
                <span className="rounded-full border border-line bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-muted">
                  stc
                </span>
              </div>
              <div className="mt-5 flex flex-wrap items-center gap-5">
                <ScoreRing score={82} level="high" />
                <div className="min-w-0">
                  <RiskBadge level="high" />
                  <h2 className="mt-2 font-serif text-xl font-semibold">
                    Case SCG-1078
                  </h2>
                  <p className="mt-1 text-xs text-muted">
                    +966 55 407 2291
                  </p>
                </div>
              </div>
              <ul className="mt-5 divide-y divide-line rounded-lg border border-line">
                {exampleSignals.map((signal) => (
                  <li
                    key={signal.label}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 text-sm"
                  >
                    <span>{signal.label}</span>
                    <span className="font-mono text-xs font-semibold text-risk-medium">
                      {signal.points}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg border border-risk-high/20 bg-risk-high-soft/60 p-3.5">
                <div className="flex flex-wrap gap-2">
                  <RiskBadge level="high" />
                  <UrgentBadge />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  Sent to human review. A reviewer must verify the subscriber
                  before continuity is restored.
                </p>
              </div>
              <p className="mt-4 text-[11px] text-muted">
                Example only. Synthetic signals.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-accent text-white">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-10 sm:px-8 sm:py-12 md:grid-cols-[0.7fr_1.3fr] md:items-start">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
            Operating principle
          </p>
          <div>
            <p className="font-serif text-2xl font-semibold leading-snug sm:text-3xl">
              AI does the mechanical work. Humans govern the consequential
              decisions.
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75">
              The score is deterministic and every signal is visible. Approval,
              rejection, and requests for more information require a named
              reviewer and a written reason.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">The ghost number problem</p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
            Reassignment does not reset the past.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted">
            A new subscriber can hold a perfectly legitimate SIM while inheriting
            the recovery paths of the person who held the number before them.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {problemSteps.map((step) => (
            <article key={step.number} className="card p-6">
              <span className="font-mono text-xs font-semibold text-accent">
                {step.number}
              </span>
              <h3 className="mt-4 font-serif text-xl font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Separation of labour, by design.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted">
              The guard keeps the mechanical and the consequential apart. That
              makes the system faster to operate and easier to defend.
            </p>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            <article className="rounded-2xl border border-line bg-background p-7 sm:p-8">
              <p className="eyebrow">Mechanical work</p>
              <h3 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
                The model handles the arithmetic
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Deterministic scoring means the same inputs always produce the
                same result.
              </p>
              <ul className="mt-6 space-y-3">
                {modelSteps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed">
                    <span
                      className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent-soft font-mono text-[11px] font-semibold text-accent"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl border border-accent/20 bg-accent-soft p-7 sm:p-8">
              <p className="eyebrow">Consequential decisions</p>
              <h3 className="mt-3 font-serif text-2xl font-semibold tracking-tight">
                A reviewer owns the outcome
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                A score can describe exposure. Only a person can judge whether
                continuity is safe.
              </p>
              <ul className="mt-6 space-y-3">
                {reviewerSteps.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed">
                    <span
                      className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-surface font-mono text-[11px] font-semibold text-accent"
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </article>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-risk-low/20 bg-risk-low-soft/60 p-5">
              <div className="flex items-center justify-between gap-2">
                <RiskBadge level="low" />
                <span className="font-mono text-xs text-muted">0–29</span>
              </div>
              <p className="mt-3 text-sm font-semibold">Auto-cleared</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Below the review threshold. Logged automatically.
              </p>
            </div>
            <div className="rounded-xl border border-risk-medium/20 bg-risk-medium-soft/60 p-5">
              <div className="flex items-center justify-between gap-2">
                <RiskBadge level="medium" />
                <span className="font-mono text-xs text-muted">30–69</span>
              </div>
              <p className="mt-3 text-sm font-semibold">Human review</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Routed to a named reviewer in the queue.
              </p>
            </div>
            <div className="rounded-xl border border-risk-high/20 bg-risk-high-soft/60 p-5">
              <div className="flex items-center justify-between gap-2">
                <RiskBadge level="high" />
                <span className="font-mono text-xs text-muted">70–100</span>
              </div>
              <p className="mt-3 text-sm font-semibold">Urgent review</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                Surfaced first and marked urgent for a reviewer.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <p className="eyebrow">Saudi context</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
              Built around local number continuity.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              The prototype validates Saudi mobile numbers in +966 and local 05X
              formats, with stc as the worked carrier example. The case model
              reflects the signals a continuity team would actually need:
              dormancy, linked accounts, SIM swaps, and device changes.
            </p>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="card p-5">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Number format
              </dt>
              <dd className="mt-2 text-sm font-medium">
                +966 5X XXX XXXX
              </dd>
            </div>
            <div className="card p-5">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Example carrier
              </dt>
              <dd className="mt-2 text-sm font-medium">stc</dd>
            </div>
            <div className="card p-5">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Decision record
              </dt>
              <dd className="mt-2 text-sm font-medium">
                Reviewer, reason, timestamp
              </dd>
            </div>
            <div className="card p-5">
              <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                Data
              </dt>
              <dd className="mt-2 text-sm font-medium">
                Synthetic prototype only
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="rounded-2xl bg-accent p-7 text-white sm:p-12">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Try the prototype
              </p>
              <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight sm:text-4xl">
                Score a reassignment. Then make the call.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Every assessment produces an explainable case file. Medium and
                high risk cases wait for a human decision and a written reason.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/assess"
                className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-accent transition-colors hover:bg-accent-soft"
              >
                Run an assessment
              </Link>
              <Link
                href="/queue"
                className="rounded-lg border border-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                Review the queue
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
