import Link from "next/link";
import { EchoMascot } from "@/components/echo-mascot";

export default function NotFound() {
  return (
    <main
      id="content"
      className="echo-hero mx-auto flex w-full max-w-6xl flex-1 items-center px-5 py-20 sm:px-8"
    >
      <div className="grid w-full items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative mx-auto w-full max-w-xs">
          <div
            className="absolute inset-x-6 bottom-4 h-32 rounded-[2rem] border border-ghost-strong/20 bg-ghost-soft/70"
            aria-hidden="true"
          />
          <EchoMascot
            mood="thinking"
            idPrefix="not-found-echo"
            className="relative z-10 mx-auto w-56 sm:w-64"
          />
        </div>
        <div>
          <p className="eyebrow">Not found</p>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
            This page has vanished.
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
            The case may not exist, or the link may be incomplete. Echo checked
            the haunted inbox and found nothing. Return to the review queue or
            start a new assessment.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/queue" className="btn-primary">
              Go to review queue
            </Link>
            <Link href="/assess" className="btn-secondary">
              New assessment
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
