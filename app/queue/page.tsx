import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { RiskBadge, StatusBadge, UrgentBadge } from "@/components/badges";
import { EmptyState } from "@/components/empty-state";
import { QueueSkeleton } from "@/components/skeletons";
import { getCases } from "@/lib/db";
import { formatAge, formatCount } from "@/lib/format";
import {
  isCaseStatus,
  isRiskLevel,
  riskLabel,
  statusLabel,
} from "@/lib/labels";
import { formatSaudiPhone } from "@/lib/phone";
import type { CaseStatus, RiskLevel } from "@/lib/types";

export const metadata: Metadata = {
  title: "Review queue",
};

const urgencyRank: Record<RiskLevel, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

const statusOptions: Array<CaseStatus | "all"> = [
  "pending",
  "all",
  "auto_cleared",
  "approved",
  "rejected",
  "more_info_requested",
];

function readParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default function QueuePage({ searchParams }: PageProps<"/queue">) {
  return (
    <main
      id="content"
      className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="eyebrow">Operations</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
            Review queue
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted">
            Medium and high risk cases awaiting a named human decision. Urgent
            cases are surfaced first, then the oldest.
          </p>
        </div>
        <Link href="/assess" className="btn-primary shrink-0">
          New assessment
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="mt-8">
        <Suspense fallback={<QueueSkeleton />}>
          <QueueContent searchParams={searchParams} />
        </Suspense>
      </div>
    </main>
  );
}

async function QueueContent({
  searchParams,
}: Pick<PageProps<"/queue">, "searchParams">) {
  await connection();
  const params = await searchParams;
  const levelParam = readParam(params.level);
  const statusParam = readParam(params.status);
  const level: RiskLevel | "all" = isRiskLevel(levelParam)
    ? levelParam
    : "all";
  const status: CaseStatus | "all" =
    statusParam === "all"
      ? "all"
      : isCaseStatus(statusParam)
        ? statusParam
        : "pending";

  const allCases = await getCases();
  const pending = allCases.filter((item) => item.status === "pending");
  const urgent = pending.filter((item) => item.level === "high").length;
  const oldestPending = pending.reduce<string | null>((oldest, item) => {
    if (!oldest) return item.createdAt;
    return new Date(item.createdAt).getTime() < new Date(oldest).getTime()
      ? item.createdAt
      : oldest;
  }, null);

  const visible = allCases
    .filter((item) => level === "all" || item.level === level)
    .filter((item) => status === "all" || item.status === status)
    .sort((left, right) => {
      const urgency =
        urgencyRank[left.level] - urgencyRank[right.level];
      if (urgency !== 0) return urgency;
      return (
        new Date(left.createdAt).getTime() -
        new Date(right.createdAt).getTime()
      );
    });

  const filterDescription = [
    level === "all" ? null : riskLabel(level),
    status === "all" ? null : statusLabel(status),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Pending review
          </dt>
          <dd className="mt-2 font-serif text-3xl font-semibold tabular-nums">
            {pending.length}
          </dd>
        </div>
        <div className="card p-5">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Urgent pending
          </dt>
          <dd className="mt-2 font-serif text-3xl font-semibold tabular-nums text-risk-high">
            {urgent}
          </dd>
        </div>
        <div className="card p-5">
          <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
            Oldest pending
          </dt>
          <dd className="mt-2 font-serif text-3xl font-semibold tabular-nums">
            {oldestPending ? `${formatAge(oldestPending)} ago` : "None"}
          </dd>
        </div>
      </dl>

      <form
        method="get"
        action="/queue"
        className="card mt-5 p-4 sm:p-5"
        aria-label="Filter cases"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div className="w-full md:w-52">
            <label
              htmlFor="level"
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted"
            >
              Risk level
            </label>
            <select
              id="level"
              name="level"
              key={`level-${level}`}
              defaultValue={level}
              className="select mt-1.5"
            >
              <option value="all">All levels</option>
              <option value="low">Low risk</option>
              <option value="medium">Medium risk</option>
              <option value="high">High risk</option>
            </select>
          </div>

          <div className="w-full md:w-56">
            <label
              htmlFor="status"
              className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              key={`status-${status}`}
              defaultValue={status}
              className="select mt-1.5"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option === "all" ? "All statuses" : statusLabel(option)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:ml-auto">
            <button type="submit" className="btn-secondary">
              Apply filters
            </button>
            <Link href="/queue" className="btn-secondary">
              Reset
            </Link>
          </div>
        </div>
      </form>

      <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-tight">
            {status === "pending" ? "Awaiting decision" : "Case list"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Showing {formatCount(visible.length, "case")}
            {filterDescription ? ` · ${filterDescription}` : ""} · sorted by
            urgency, then oldest first.
          </p>
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title="No cases in this view"
            description="No cases match the selected level and status. Try widening the filters or resetting the queue."
            action={
              <Link href="/queue" className="btn-secondary">
                Reset filters
              </Link>
            }
          />
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {visible.map((item) => (
            <li key={item.id} className="card">
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap gap-2">
                    <RiskBadge level={item.level} />
                    {item.level === "high" && item.status === "pending" ? (
                      <UrgentBadge />
                    ) : null}
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <Link
                      href={`/queue/${item.id}`}
                      className="font-mono text-sm font-semibold text-accent underline-offset-4 hover:underline"
                    >
                      {item.id}
                    </Link>
                    <span className="text-sm font-medium">
                      {formatSaudiPhone(item.phoneNumber)}
                    </span>
                    <span className="text-xs text-muted">{item.carrier}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Opened {formatAge(item.createdAt)} ago ·{" "}
                    {formatCount(item.signals.length, "signal")} ·{" "}
                    {formatCount(item.linkedAccounts, "linked account")}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-5 sm:justify-end">
                  <div className="text-right">
                    <div>
                      <span className="font-serif text-2xl font-semibold tabular-nums">
                        {item.score}
                      </span>
                      <span className="text-xs text-muted"> / 100</span>
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Risk score
                    </span>
                  </div>
                  <Link
                    href={`/queue/${item.id}`}
                    className="btn-secondary whitespace-nowrap"
                  >
                    {item.status === "pending" ? "Review case" : "Open case"}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
