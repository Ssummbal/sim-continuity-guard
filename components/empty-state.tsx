import type { ReactNode } from "react";
import { EchoMascot } from "@/components/echo-mascot";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[var(--radius-xl)] border border-dashed border-ghost-strong/25 bg-surface/85 px-6 py-14 text-center shadow-[var(--shadow-sm)]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,var(--ghost-soft),transparent_56%)]"
        aria-hidden="true"
      />
      <div className="relative">
        <EchoMascot
          mood="thinking"
          idPrefix="empty-echo"
          className="mx-auto w-24 sm:w-28"
        />
        <h2 className="mt-2 font-serif text-xl font-bold">{title}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
          {description}
        </p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}
