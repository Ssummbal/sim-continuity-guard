"use client";

import { useSearchParams } from "next/navigation";
import { Celebration } from "@/components/celebration";

export function SignupNotice() {
  const searchParams = useSearchParams();

  if (searchParams.get("status") !== "check-email") {
    return null;
  }

  return (
    <>
      <Celebration message="Account created. Check your email to confirm it before signing in." />
      <div
        role="status"
        className="mb-5 rounded-[var(--radius-lg)] border border-mint/30 bg-mint-soft/70 px-3.5 py-3 text-sm leading-relaxed text-mint-strong"
      >
        Check your email to confirm your account, then sign in. Once confirmed,
        you can open the assessment queue and audit log straight away.
      </div>
    </>
  );
}
