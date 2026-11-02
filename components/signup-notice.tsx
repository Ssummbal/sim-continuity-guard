"use client";

import { useSearchParams } from "next/navigation";

export function SignupNotice() {
  const searchParams = useSearchParams();

  if (searchParams.get("status") !== "check-email") {
    return null;
  }

  return (
    <div
      role="status"
      className="mb-5 rounded-lg border border-risk-low/30 bg-risk-low-soft/60 px-3.5 py-3 text-sm leading-relaxed text-risk-low"
    >
      Check your email to confirm your account, then sign in. Once confirmed,
      you can open the assessment queue and audit log straight away.
    </div>
  );
}
