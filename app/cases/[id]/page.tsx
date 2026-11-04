import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import {
  RiskBadge,
  StatusBadge,
  UrgentBadge,
} from "@/components/badges";
import { CaseFacts } from "@/components/case-facts";
import { Celebration } from "@/components/celebration";
import { Chat } from "@/components/chat";
import { OutcomePanel } from "@/components/outcome-panel";
import { ScoreRing } from "@/components/score-ring";
import { SignalList } from "@/components/signal-list";
import { CaseSkeleton } from "@/components/skeletons";
import { requireUser } from "@/lib/auth";
import { getCaseById } from "@/lib/db";
import { formatAge, formatDateTime } from "@/lib/format";
import { actionLabel } from "@/lib/labels";
import { formatSaudiPhone } from "@/lib/phone";

export const metadata: Metadata = {
  title: "Case file",
};

const levelNarrative = {
  low: "The weighted signals stayed below the human-review threshold.",
  medium: "The weighted signals crossed the human-review threshold.",
  high: "The weighted signals place this case in the urgent review band.",
} as const;

export default function CasePage({ params }: PageProps<"/cases/[id]">) {
  return (
    <main
      id="content"
      className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14"
    >
      <Suspense fallback={<CaseSkeleton />}>
        <CaseContent params={params} />
      </Suspense>
    </main>
  );
}

async function CaseContent({
  params,
}: Pick<PageProps<"/cases/[id]">, "params">) {
  await requireUser();
  await connection();
  const { id } = await params;
  const item = await getCaseById(id);

  if (!item) {
    notFound();
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link
          href="/queue"
          className="inline-flex items-center gap-1.5 font-medium text-muted transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span>
          Review queue
        </Link>
        <span className="text-xs text-muted">
          Opened <time dateTime={item.createdAt}>{formatDateTime(item.createdAt)}</time>
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <RiskBadge level={item.level} />
            {item.level === "high" ? <UrgentBadge /> : null}
            <StatusBadge status={item.status} />
          </div>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            Case <span className="font-mono text-3xl sm:text-4xl">{item.id}</span>
          </h1>
          <p className="mt-2 text-sm text-muted">
            {formatSaudiPhone(item.phoneNumber)} · {item.carrier} ·{" "}
            {formatAge(item.createdAt)} old
          </p>
        </div>
        {item.status === "pending" ? (
          <Link href={`/queue/${item.id}`} className="btn-primary shrink-0">
            Open reviewer view
            <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <Link href="/audit" className="btn-secondary shrink-0">
            View audit log
          </Link>
        )}
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-8">
          <section
            className="card relative overflow-hidden p-6 sm:p-8"
            aria-labelledby="assessment-heading"
          >
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_8%,var(--ghost-soft),transparent_42%)]"
              aria-hidden="true"
            />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <ScoreRing score={item.score} level={item.level} />
              <div className="min-w-0">
                <p className="eyebrow">Assessment</p>
                <h2
                  id="assessment-heading"
                  className="mt-2 font-serif text-3xl font-semibold tracking-tight"
                >
                  Score {item.score} of 100
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {levelNarrative[item.level]} {item.signals.length} signal
                  {item.signals.length === 1 ? "" : "s"} contributed to this
                  result.
                </p>
                <p className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-lg border border-line bg-surface-muted/60 px-3 py-2 text-xs">
                  <span className="font-semibold uppercase tracking-[0.12em] text-muted">
                    Recommended
                  </span>
                  <span className="font-semibold text-foreground">
                    {actionLabel(item.recommendedAction)}
                  </span>
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="signals-heading">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="eyebrow">Explainability</p>
                <h2
                  id="signals-heading"
                  className="mt-2 font-serif text-2xl font-semibold tracking-tight"
                >
                  Why this score
                </h2>
                <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
                  Each triggered signal is recorded with a plain-English
                  explanation so the reviewer can challenge the model.
                </p>
              </div>
              <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
                {item.signals.length} signal
                {item.signals.length === 1 ? "" : "s"} captured
              </span>
            </div>
            <div className="mt-4">
              <SignalList signals={item.signals} />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <OutcomePanel item={item} />

          <section className="card p-6" aria-labelledby="inputs-heading">
            <h2
              id="inputs-heading"
              className="font-serif text-xl font-semibold tracking-tight"
            >
              Case inputs
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Captured at assessment time and retained with the case file.
            </p>
            <div className="mt-5">
              <CaseFacts item={item} />
            </div>
          </section>
        </aside>
      </div>

      {item.status === "approved" ? (
        <Celebration
          onceKey={`scg-approved-${item.id}`}
          message="Case approved. The audit log has been updated."
        />
      ) : null}

      <div className="mt-10">
        <Chat />
      </div>
    </>
  );
}
