function Bar({ className = "" }: { className?: string }) {
  return <div className={`h-3 rounded-full bg-line ${className}`} />;
}

function StatusLabel({ label }: { label: string }) {
  return (
    <p className="sr-only" role="status">
      {label}
    </p>
  );
}

export function QueueSkeleton() {
  return (
    <div>
      <StatusLabel label="Loading the review queue" />
      <div aria-hidden="true" className="animate-pulse space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="card p-5">
              <Bar className="w-24" />
              <Bar className="mt-4 h-8 w-16" />
            </div>
          ))}
        </div>
        <div className="card p-5">
          <div className="flex flex-wrap gap-4">
            <Bar className="h-10 w-52" />
            <Bar className="h-10 w-52" />
          </div>
        </div>
        <div className="space-y-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="card p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Bar className="w-20" />
                <Bar className="w-24" />
              </div>
              <Bar className="mt-4 h-4 w-64 max-w-full" />
              <Bar className="mt-3 w-80 max-w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CaseSkeleton() {
  return (
    <div>
      <StatusLabel label="Loading case details" />
      <div aria-hidden="true" className="animate-pulse space-y-6">
        <Bar className="w-32" />
        <Bar className="h-9 w-72 max-w-full" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <div className="card p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="size-36 shrink-0 rounded-full bg-surface-muted" />
                <div className="flex-1 space-y-3">
                  <Bar className="w-24" />
                  <Bar className="h-6 w-56 max-w-full" />
                  <Bar className="w-full" />
                  <Bar className="w-3/4" />
                </div>
              </div>
            </div>
            <div className="card p-5">
              <Bar className="w-36" />
              <div className="mt-6 space-y-5">
                <div className="space-y-2">
                  <Bar className="w-40" />
                  <Bar className="w-full" />
                </div>
                <div className="space-y-2">
                  <Bar className="w-52" />
                  <Bar className="w-5/6" />
                </div>
                <div className="space-y-2">
                  <Bar className="w-32" />
                  <Bar className="w-full" />
                </div>
              </div>
            </div>
          </div>
          <div className="card p-6">
            <Bar className="w-24" />
            <Bar className="mt-5 h-7 w-48 max-w-full" />
            <div className="mt-5 space-y-3">
              <Bar className="w-full" />
              <Bar className="w-4/5" />
              <Bar className="w-3/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AuditSkeleton() {
  return (
    <div>
      <StatusLabel label="Loading the audit log" />
      <div aria-hidden="true" className="animate-pulse space-y-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="card p-5">
              <Bar className="w-28" />
              <Bar className="mt-4 h-8 w-16" />
            </div>
          ))}
        </div>
        <div className="card divide-y divide-line">
          {[0, 1, 2, 3, 4].map((item) => (
            <div key={item} className="flex flex-wrap items-center gap-4 p-5">
              <Bar className="w-24" />
              <Bar className="w-32" />
              <Bar className="w-40" />
              <Bar className="ml-auto w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
