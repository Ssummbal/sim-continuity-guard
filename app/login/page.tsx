import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <main
      id="content"
      className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-5 py-10 sm:px-8 sm:py-14"
    >
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">←</span>
          Overview
        </Link>

        <section className="card mt-6 p-6 sm:p-8" aria-labelledby="login-heading">
          <p className="eyebrow">Restricted access</p>
          <h1
            id="login-heading"
            className="mt-3 font-serif text-3xl font-semibold tracking-tight"
          >
            Sign in
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Use your reviewer account to open the assessment queue and audit
            log. All actions are recorded against your account.
          </p>

          <div className="mt-6">
            <LoginForm />
          </div>

          <p className="mt-6 border-t border-line pt-4 text-xs leading-relaxed text-muted">
            Accounts are created by an administrator. There is no public
            sign-up.
          </p>
        </section>
      </div>
    </main>
  );
}
