"use client";

import { usePathname } from "next/navigation";
import { signOut } from "@/app/logout/actions";

export function LogoutButton() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <form action={signOut}>
      <button
        type="submit"
        className="rounded-lg px-2.5 py-1.5 text-sm text-muted transition-colors hover:bg-surface-muted hover:text-foreground"
      >
        Sign out
      </button>
    </form>
  );
}
