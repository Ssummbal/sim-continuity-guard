"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LoginActionState } from "@/lib/types";

const MIN_PASSWORD_LENGTH = 8;
const INVALID_CREDENTIALS = "Incorrect email or password.";
const UNCONFIRMED_EMAIL = "Confirm your email address before signing in.";
const GENERIC_ERROR = "Sign-in could not be completed. Try again.";
const GENERIC_SIGN_UP_ERROR =
  "Account creation could not be completed. Try again.";

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

export async function signUp(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  const errors: NonNullable<LoginActionState["errors"]> = {};

  if (!email) {
    errors.email = "Enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm your password.";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      error: "Check the highlighted fields and try again.",
      errors,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    const message = error.message.toLowerCase();

    if (message.includes("already registered")) {
      return {
        error: "An account with this email already exists. Try signing in.",
      };
    }

    if (message.includes("password")) {
      return {
        error: `That password is not accepted. Use at least ${MIN_PASSWORD_LENGTH} characters.`,
      };
    }

    if (message.includes("email")) {
      return {
        error: "Check that your email address is valid and try again.",
      };
    }

    return { error: GENERIC_SIGN_UP_ERROR };
  }

  if (data.session) {
    redirect("/pending");
  }

  return {
    message:
      "Check your email to confirm your account. An administrator must approve it before you can sign in.",
  };
}
