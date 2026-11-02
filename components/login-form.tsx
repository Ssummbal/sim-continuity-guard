"use client";

import { useActionState, useState } from "react";
import { signIn, signUp } from "@/app/login/actions";
import type { LoginActionState } from "@/lib/types";

const initialState: LoginActionState = {};

type Mode = "signin" | "signup";

const labelClass =
  "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted";

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="mt-1.5 text-xs text-risk-high">{message}</p>;
}

export function LoginForm() {
  const [mode, setMode] = useState<Mode>("signin");
  const [signInState, signInAction, signInPending] = useActionState(
    signIn,
    initialState,
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    initialState,
  );

  const isSignUp = mode === "signup";
  const state = isSignUp ? signUpState : signInState;
  const pending = isSignUp ? signUpPending : signInPending;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-surface-muted p-1">
        <button
          type="button"
          onClick={() => setMode("signin")}
          aria-pressed={!isSignUp}
          className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
            isSignUp
              ? "text-muted hover:text-foreground"
              : "bg-surface text-foreground shadow-sm"
          }`}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          aria-pressed={isSignUp}
          className={`rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
            isSignUp
              ? "bg-surface text-foreground shadow-sm"
              : "text-muted hover:text-foreground"
          }`}
        >
          Create account
        </button>
      </div>

      {state.error ? (
        <div
          role="alert"
          className="rounded-lg border border-risk-high/30 bg-risk-high-soft/60 px-3.5 py-3 text-sm leading-relaxed text-risk-high"
        >
          {state.error}
        </div>
      ) : null}

      {state.message ? (
        <div
          role="status"
          className="rounded-lg border border-risk-low/30 bg-risk-low-soft/60 px-3.5 py-3 text-sm leading-relaxed text-risk-low"
        >
          {state.message}
        </div>
      ) : null}

      {isSignUp ? (
        <form action={signUpAction} className="space-y-4" noValidate>
          <div>
            <label htmlFor="signup-email" className={labelClass}>
              Email
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input mt-1.5"
              placeholder="reviewer@example.com"
              aria-invalid={Boolean(state.errors?.email)}
            />
            <FieldError message={state.errors?.email} />
          </div>

          <div>
            <label htmlFor="signup-password" className={labelClass}>
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="input mt-1.5"
              aria-invalid={Boolean(state.errors?.password)}
            />
            <FieldError message={state.errors?.password} />
          </div>

          <div>
            <label htmlFor="signup-confirm-password" className={labelClass}>
              Confirm password
            </label>
            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              className="input mt-1.5"
              aria-invalid={Boolean(state.errors?.confirmPassword)}
            />
            <FieldError message={state.errors?.confirmPassword} />
          </div>

          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Creating account…" : "Create account"}
          </button>

          <p className="text-xs leading-relaxed text-muted">
            New accounts start as pending and need administrator approval before
            they can open the queue or audit log.
          </p>
        </form>
      ) : (
        <form action={signInAction} className="space-y-4" noValidate>
          <div>
            <label htmlFor="signin-email" className={labelClass}>
              Email
            </label>
            <input
              id="signin-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="input mt-1.5"
              placeholder="reviewer@example.com"
            />
          </div>

          <div>
            <label htmlFor="signin-password" className={labelClass}>
              Password
            </label>
            <input
              id="signin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="input mt-1.5"
            />
          </div>

          <button type="submit" disabled={pending} className="btn-primary w-full">
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      )}
    </div>
  );
}
