import Link from "next/link";
import { FooterFact } from "@/components/footer-fact";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-surface/80">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-5 py-9 text-xs leading-relaxed text-muted sm:flex-row sm:items-start sm:justify-between sm:px-8">
        <div className="max-w-xl">
          <p className="font-semibold text-foreground">
            SIM Continuity Guard · Prototype
          </p>
          <p className="mt-1">
            Synthetic demonstration data only. Not connected to stc or any
            production identity system.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span>Saudi Arabia · +966 mobile formats</span>
            <Link href="/audit" className="text-link">
              Audit log
            </Link>
          </div>
        </div>
        <FooterFact />
      </div>
    </footer>
  );
}
