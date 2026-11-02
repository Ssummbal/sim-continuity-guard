import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database";

let client: SupabaseClient<Database> | undefined;

export function getSupabaseAdmin() {
  client ??= createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  return client;
}
