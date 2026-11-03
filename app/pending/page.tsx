import type { Metadata } from "next";
import { signOut } from "@/app/logout/actions";

export const metadata: Metadata = {
  title: "Awaiting approval",
};

export default function PendingPage() {
  return (
    <main
      id="content"
      className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--accent-soft),transparent_62%)] px-5 py-10 sm:px-8 sm:py-14"
    >
      <div className="w-full max-w-md">
        <section
          className="card mt-6 p-6 sm:p-8"
          aria-labelledby="pending-heading"
        >
          <p className="eyebrow">Account status</p>
          <h1
            id="pending-heading"
            className="mt-3 font-serif text-3xl font-semibold tracking-tight"
          >
            Waiting for approval
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Your account is waiting for an administrator to approve it. You will
            be able to open the assessment queue and audit log once approval is
            complete.
          </p>

          <form action={signOut} className="mt-6">
            <button type="submit" className="btn-secondary w-full">
              Sign out
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
