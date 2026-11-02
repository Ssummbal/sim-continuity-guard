import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";

export const requireUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return user;
});
