"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LoginActionState } from "@/lib/types";

const INVALID_CREDENTIALS = "Incorrect email or password.";
const UNCONFIRMED_EMAIL = "Confirm your email address before signing in.";
const GENERIC_ERROR = "Sign-in could not be completed. Try again.";

export async function signIn(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const message = error.message.toLowerCase();

    if (message.includes("email not confirmed")) {
      return { error: UNCONFIRMED_EMAIL };
    }

    if (message.includes("invalid login credentials")) {
      return { error: INVALID_CREDENTIALS };
    }

    return { error: GENERIC_ERROR };
  }

  redirect("/");
}
