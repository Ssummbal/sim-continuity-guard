import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { DecisionBadge } from "@/components/badges";
import { EmptyState } from "@/components/empty-state";
import { AuditSkeleton } from "@/components/skeletons";
import { getAuditLog } from "@/lib/db";
import { formatCount, formatDateTime } from "@/lib/format";
import { formatSaudiPhone } from "@/lib/phone";

export const metadata: Metadata = {
  title: "Audit log",
};

export default function AuditPage() {
  return (
    <main
      id="content"
      className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Accountability</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            Audit log
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Every automated clearance and human decision, newest first.
            Human entries carry the reviewer, the written reason, and the
            decision timestamp.
          </p>
        </div>
        <Link href="/queue" className="btn-secondary shrink-0">
          Review queue
        </Link>
      </div>

      <div className="mt-8">
        <Suspense fallback={<AuditSkeleton />}>
          <AuditContent />
        </Suspense>
      </div>
    </main>
  );
}

async function AuditContent() {
  await connection();
  const entries = await getAuditLog();
  const humanDecisions = entries.filter(
    (entry) => entry.decision !== "auto_cleared",
  ).length;
  const automated = entries.length - humanDecisions;

  return (
    <>
      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Total entries
          </dt>
          <dd className="mt-2 font-serif text-3xl font-semibold tabular-nums">
            {entries.length}
          </dd>
        </div>
        <div className="card p-5">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Human decisions
          </dt>
          <dd className="mt-2 font-serif text-3xl font-semibold tabular-nums">
            {humanDecisions}
          </dd>
        </div>
        <div className="card p-5">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Auto-cleared by policy
          </dt>
          <dd className="mt-2 font-serif text-3xl font-semibold tabular-nums">
            {automated}
          </dd>
        </div>
      </dl>

      {entries.length === 0 ? (
        <div className="mt-5">
          <EmptyState
            title="No audit entries yet"
            description="Automated clearances and human decisions will appear here as cases are processed."
            action={
              <Link href="/assess" className="btn-primary">
                Run an assessment
              </Link>
            }
          />
        </div>
      ) : (
        <>
          <p className="mt-6 text-sm text-muted">
            Showing {formatCount(entries.length, "entry")} · timestamps in Saudi
            time.
          </p>

          <div className="mt-3 hidden overflow-hidden rounded-2xl border border-line bg-surface lg:block">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Audit log of automated clearances and human decisions
              </caption>
              <thead className="border-b border-line bg-surface-muted/60 text-[11px] uppercase tracking-[0.12em] text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Case
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Decision
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Reviewer
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Reason
                  </th>
                  <th scope="col" className="px-5 py-3 font-semibold">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {entries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="align-top transition-colors hover:bg-surface-muted/30"
                  >
                    <th scope="row" className="px-5 py-4 font-normal">
                      <Link
                        href={`/cases/${entry.caseId}`}
                        className="font-mono text-sm font-semibold text-accent underline-offset-4 hover:underline"
                      >
                        {entry.caseId}
                      </Link>
                      <span className="mt-1 block text-xs text-muted">
                        {formatSaudiPhone(entry.phoneNumber)}
                      </span>
                    </th>
                    <td className="px-5 py-4">
                      <DecisionBadge decision={entry.decision} />
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-medium">{entry.reviewer}</span>
                      {entry.decision === "auto_cleared" ? (
                        <span className="mt-1 block text-xs text-muted">
                          Automated
                        </span>
                      ) : null}
                    </td>
                    <td className="max-w-md px-5 py-4 text-sm leading-relaxed text-muted">
                      {entry.reason}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm">
                      <time dateTime={entry.timestamp}>
                        {formatDateTime(entry.timestamp)}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-3 space-y-3 lg:hidden">
            {entries.map((entry) => (
              <li key={entry.id} className="card p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={`/cases/${entry.caseId}`}
                    className="font-mono text-sm font-semibold text-accent underline-offset-4 hover:underline"
                  >
                    {entry.caseId}
                  </Link>
                  <DecisionBadge decision={entry.decision} />
                </div>
                <p className="mt-1 text-xs text-muted">
                  {formatSaudiPhone(entry.phoneNumber)}
                </p>
                <p className="mt-3 text-sm leading-relaxed">{entry.reason}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
                  <span>
                    {entry.reviewer}
                    {entry.decision === "auto_cleared" ? " · Automated" : ""}
                  </span>
                  <time dateTime={entry.timestamp}>
                    {formatDateTime(entry.timestamp)}
                  </time>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

