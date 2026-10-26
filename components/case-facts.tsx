import type { ReactNode } from "react";
import { formatAge, formatDateTime } from "@/lib/format";
import { formatSaudiPhone } from "@/lib/phone";
import type { Case } from "@/lib/types";

function Fact({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div>
      <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}

export function CaseFacts({ item }: { item: Case }) {
  return (
    <dl className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2 lg:grid-cols-1">
      <Fact label="Phone number" value={formatSaudiPhone(item.phoneNumber)} />
      <Fact label="Carrier" value={item.carrier} />
      <Fact
        label="Opened"
        value={
          <span>
            {formatDateTime(item.createdAt)}
            <span className="ml-1.5 font-normal text-muted">
              ({formatAge(item.createdAt)} ago)
            </span>
          </span>
        }
      />
      <Fact label="Inactive before reassignment" value={`${item.daysInactive} days`} />
      <Fact label="Recycled number" value={item.wasRecycled ? "Yes" : "No"} />
      <Fact label="Linked accounts" value={item.linkedAccounts} />
      <Fact
        label="SIM swap, last 30 days"
        value={item.recentSimSwap ? "Yes" : "No"}
      />
      <Fact label="Device changed" value={item.deviceChanged ? "Yes" : "No"} />
    </dl>
  );
}
