import Link from "next/link";
import { Suspense } from "react";
import { EchoMascot } from "@/components/echo-mascot";
import { LogoutButton } from "@/components/logout-button";

const navigation = [
  { href: "/ask", label: "Ask Echo" },
  { href: "/assess", label: "Assess" },
  { href: "/queue", label: "Review queue" },
  { href: "/audit", label: "Audit log" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/90 shadow-[var(--shadow-sm)] backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-full focus-visible:outline-offset-4"
          aria-label="SIM Continuity Guard home"
        >
          <span className="grid size-10 place-items-center overflow-hidden rounded-full border border-ghost-strong/20 bg-ghost-soft shadow-[var(--shadow-sm)]">
            <EchoMascot
              idPrefix="header-echo"
              className="echo-mascot--still w-8 translate-y-0.5"
            />
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-base font-bold tracking-tight">
              SIM Continuity Guard
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              Trust &amp; Safety
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:bg-ghost-soft hover:text-ghost-strong"
            >
              {item.label}
            </Link>
          ))}
          <Suspense fallback={null}>
            <LogoutButton />
          </Suspense>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-mint/25 bg-mint-soft px-2.5 py-1 text-[11px] font-semibold text-mint-strong">
            <span
              className="size-1.5 rounded-full bg-mint"
              aria-hidden="true"
            />
            Demo environment
          </span>
        </nav>
      </div>
    </header>
  );
}
