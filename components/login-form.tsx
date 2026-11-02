"use client";

import { useActionState } from "react";
import { signIn } from "@/app/login/actions";
import type { LoginActionState } from "@/lib/types";

const initialState: LoginActionState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      {state.error ? (
        <div
          role="alert"
          className="rounded-lg border border-risk-high/30 bg-risk-high-soft/60 px-3.5 py-3 text-sm leading-relaxed text-risk-high"
        >
          {state.error}
        </div>
      ) : null}

      <div>
        <label
          htmlFor="email"
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="input mt-1.5"
          placeholder="reviewer@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted"
        >
          Password
        </label>
        <input
          id="password"
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
  );
}
