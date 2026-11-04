import type { Metadata } from "next";
import { EchoChat } from "@/components/echo-chat";
import { EchoMascot } from "@/components/echo-mascot";
import { EchoMythCards } from "@/components/echo-myth-cards";
import { EchoQuiz } from "@/components/echo-quiz";

export const metadata: Metadata = {
  title: "Ask Echo",
  description:
    "Meet Echo, a friendly ghost who explains mobile number recycling, ghost messages, account recovery risk, and practical ways to stay protected.",
};

export default function AskPage() {
  return (
    <main id="content" className="flex-1">
      <section className="echo-hero relative overflow-hidden border-b border-line">
        <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow text-ghost-strong">Public explainer</p>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Meet Echo, your friendly ghost guide to number recycling.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Why do old numbers come back? What is a ghost message? Echo floats
              through the practical side of recycled numbers, SMS recovery, and
              protecting the accounts tied to your phone.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[
                "Ghost messages",
                "SMS recovery risk",
                "Safe number switching",
                "Bank and app checks",
              ].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-ghost-strong/20 bg-ghost-soft/70 px-3 py-1.5 text-xs font-semibold text-ghost-strong"
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#echo-chat" className="btn-primary">
                Ask Echo a question
              </a>
              <a href="#echo-quiz" className="btn-secondary">
                Try the haunting check
              </a>
            </div>
            <p className="mt-4 max-w-xl text-xs leading-relaxed text-muted">
              General information only, not legal or financial advice. Echo
              cannot access accounts, cases, or phone numbers.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-sm lg:justify-self-end">
            <div
              className="absolute inset-x-7 top-10 h-64 rotate-[-4deg] rounded-[2rem] border border-ghost-strong/20 bg-ghost-soft/70"
              aria-hidden="true"
            />
            <div
              className="absolute inset-x-7 top-10 h-64 rotate-[4deg] rounded-[2rem] border border-accent/15 bg-accent-soft/60"
              aria-hidden="true"
            />
            <div className="relative rounded-[2rem] border border-ghost-strong/25 bg-surface/85 p-5 shadow-[0_30px_80px_-42px_var(--ghost-shadow)] backdrop-blur sm:p-6">
              <span className="echo-spark absolute left-5 top-5 size-3 rounded-full bg-ghost-spark" />
              <span className="echo-spark echo-spark-delayed absolute right-7 top-10 size-2 rounded-full bg-ghost-strong" />
              <span className="echo-spark echo-spark-slow absolute bottom-20 left-7 size-2 rounded-full bg-ghost-glow" />
              <EchoMascot
                mood="idle"
                idPrefix="hero-echo"
                className="mx-auto w-52 sm:w-60"
              />
              <div className="mt-2 rounded-2xl border border-ghost-strong/15 bg-ghost-soft/60 p-4 text-center">
                <p className="font-serif text-lg font-semibold leading-snug">
                  &quot;Ghost messages are just messages that arrived at the
                  wrong haunting address.&quot;
                </p>
                <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                  Echo&apos;s field note
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="echo-chat"
        className="mx-auto w-full max-w-6xl scroll-mt-24 px-5 py-12 sm:px-8 sm:py-16"
      >
        <EchoChat />
      </section>

      <section
        id="echo-quiz"
        className="scroll-mt-24 border-y border-line bg-surface/50"
      >
        <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <EchoQuiz />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <EchoMythCards />
      </section>
    </main>
  );
}
