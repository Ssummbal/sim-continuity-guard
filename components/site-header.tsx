import Link from "next/link";
import { Suspense } from "react";
import { LogoutButton } from "@/components/logout-button";

const navigation = [
  { href: "/assess", label: "Assess" },
  { href: "/queue", label: "Review queue" },
  { href: "/audit", label: "Audit log" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-surface/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3 sm:px-8">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-md"
          aria-label="SIM Continuity Guard home"
        >
          <span
            className="grid size-9 place-items-center rounded-lg bg-accent text-white"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="6" y="2.75" width="12" height="18.5" rx="2.5" />
              <path d="M10 6h4" />
              <path d="M9.5 18.25h5" />
              <path d="M9 11.5h6" />
              <path d="M9 14.5h6" />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block font-serif text-base font-semibold tracking-tight">
              SIM Continuity Guard
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
              Trust &amp; Safety
            </span>
          </span>
        </Link>

        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded px-1 py-1 text-muted transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Suspense fallback={null}>
            <LogoutButton />
          </Suspense>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-muted">
            <span
              className="size-1.5 rounded-full bg-accent"
              aria-hidden="true"
            />
            Demo environment
          </span>
        </nav>
      </div>
    </header>
  );
}
