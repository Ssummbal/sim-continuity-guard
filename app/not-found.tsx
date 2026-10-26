import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="content"
      className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-20 sm:px-8"
    >
      <p className="eyebrow">Not found</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight">
        That case is not in this workspace.
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
        The case may not exist, or the link may be incomplete. Return to the
        review queue or start a new assessment.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/queue" className="btn-primary">
          Go to review queue
        </Link>
        <Link href="/assess" className="btn-secondary">
          New assessment
        </Link>
      </div>
    </main>
  );
}
