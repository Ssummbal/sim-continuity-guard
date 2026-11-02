"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { createCase } from "@/lib/db";
import type { AssessmentActionState } from "@/lib/types";
import {
  formValuesFromFormData,
  validateAssessmentValues,
} from "@/lib/validation";

export async function submitAssessment(
  _previousState: AssessmentActionState,
  formData: FormData,
): Promise<AssessmentActionState> {
  await requireUser();

  const values = formValuesFromFormData(formData);
  const { errors, input } = validateAssessmentValues(values);

  if (!input) {
    return {
      message: "Check the highlighted fields and try again.",
      errors,
    };
  }

  const created = await createCase(input);

  revalidatePath("/queue");
  revalidatePath("/audit");
  revalidatePath(`/cases/${created.id}`);

  redirect(`/cases/${created.id}`);
}
