import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { Suspense } from "react";
import { RiskBadge, StatusBadge, UrgentBadge } from "@/components/badges";
import { CaseFacts } from "@/components/case-facts";
import { DecisionForm } from "@/components/decision-form";
import { OutcomePanel } from "@/components/outcome-panel";
import { ScoreRing } from "@/components/score-ring";
import { SignalList } from "@/components/signal-list";
import { CaseSkeleton } from "@/components/skeletons";
import { getCaseById } from "@/lib/db";
import { formatAge, formatDateTime } from "@/lib/format";
import { actionLabel } from "@/lib/labels";
import { formatSaudiPhone } from "@/lib/phone";

export const metadata: Metadata = {
  title: "Reviewer view",
};

export default function ReviewPage({ params }: PageProps<"/queue/[id]">) {
  return (
    <main
      id="content"
      className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14"
    >
      <Suspense fallback={<CaseSkeleton />}>
        <ReviewContent params={params} />
      </Suspense>
    </main>
  );
}

async function ReviewContent({
  params,
}: Pick<PageProps<"/queue/[id]">, "params">) {
  await connection();
  const { id } = await params;
  const item = await getCaseById(id);

  if (!item) {
    notFound();
  }

  const pending = item.status === "pending";

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <Link
          href="/queue"
          className="inline-flex items-center gap-1.5 font-medium text-muted transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span>
          Back to queue
        </Link>
        <span className="text-xs text-muted">
          Opened{" "}
          <time dateTime={item.createdAt}>
            {formatDateTime(item.createdAt)}
          </time>{" "}
          ({formatAge(item.createdAt)} ago)
        </span>
      </div>

      <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap gap-2">
            <RiskBadge level={item.level} />
            {item.level === "high" ? <UrgentBadge /> : null}
            <StatusBadge status={item.status} />
          </div>
          <p className="eyebrow mt-5">
            {pending ? "Reviewer view · Decision required" : "Reviewer view · Closed"}
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            Review case{" "}
            <span className="font-mono text-3xl sm:text-4xl">{item.id}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
            {pending
              ? "The model has done the mechanical scoring. Decide whether this reassignment is safe to continue, and record why."
              : "This case is no longer pending. The recorded decision is shown below and remains in the audit log."}
          </p>
          <p className="mt-2 text-sm font-medium">
            {formatSaudiPhone(item.phoneNumber)}{" "}
            <span className="font-normal text-muted">· {item.carrier}</span>
          </p>
        </div>
        <Link href={`/cases/${item.id}`} className="btn-secondary shrink-0">
          Open case file
        </Link>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-8">
          <section className="card p-6 sm:p-8" aria-labelledby="assessment-heading">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <ScoreRing score={item.score} level={item.level} />
              <div className="min-w-0">
                <p className="eyebrow">AI assessment · advisory</p>
                <h2
                  id="assessment-heading"
                  className="mt-2 font-serif text-3xl font-semibold tracking-tight"
                >
                  Score {item.score} of 100
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.signals.length} signal
                  {item.signals.length === 1 ? "" : "s"} contributed. The model
                  recommends:{" "}
                  <span className="font-semibold text-foreground">
                    {actionLabel(item.recommendedAction)}.
                  </span>
                </p>
                <p className="mt-3 text-xs leading-relaxed text-muted">
                  Weighted signals describe exposure. They do not decide the
                  case.
                </p>
              </div>
            </div>
          </section>

          <section aria-labelledby="signals-heading">
            <p className="eyebrow">Evidence</p>
            <h2
              id="signals-heading"
              className="mt-2 font-serif text-2xl font-semibold tracking-tight"
            >
              Signals to weigh
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-muted">
              Read each explanation below. If the evidence looks wrong or
              incomplete, request more information instead of guessing.
            </p>
            <div className="mt-4">
              <SignalList signals={item.signals} />
            </div>
          </section>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-6">
          {pending ? (
            <DecisionForm caseId={item.id} />
          ) : (
            <>
              <div className="rounded-xl border border-line bg-surface-muted/70 px-4 py-3">
                <p className="text-sm font-semibold">Case already decided</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  Further decisions cannot be recorded from the review queue.
                </p>
              </div>
              <OutcomePanel item={item} />
              <Link
                href={`/cases/${item.id}`}
                className="btn-secondary w-full"
              >
                Open case file
              </Link>
            </>
          )}

          <section className="card p-6" aria-labelledby="inputs-heading">
            <h2
              id="inputs-heading"
              className="font-serif text-xl font-semibold tracking-tight"
            >
              Case inputs
            </h2>
            <div className="mt-5">
              <CaseFacts item={item} />
            </div>
          </section>
        </aside>
      </div>
    </>
  );
}
