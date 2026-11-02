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
        className="rounded px-1 py-1 text-sm text-muted transition-colors hover:text-foreground"
      >
        Sign out
      </button>
    </form>
  );
}
