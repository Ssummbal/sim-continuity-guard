"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { updateCaseDecision } from "@/lib/db";
import { isDecisionOutcome } from "@/lib/labels";
import type { DecisionActionState } from "@/lib/types";
import { validateDecisionValues } from "@/lib/validation";

export async function submitDecision(
  _previousState: DecisionActionState,
  formData: FormData,
): Promise<DecisionActionState> {
  await requireUser();

  const caseId = String(formData.get("caseId") ?? "").trim();
  const outcomeValue = String(formData.get("outcome") ?? "");
  const reviewer = String(formData.get("reviewer") ?? "");
  const reason = String(formData.get("reason") ?? "");

  if (!caseId) {
    return { message: "The case reference is missing. Reload and try again." };
  }

  if (!isDecisionOutcome(outcomeValue)) {
    return { message: "Choose approve, reject, or request more information." };
  }

  const errors = validateDecisionValues(reviewer, reason);

  if (Object.keys(errors).length > 0) {
    return {
      message: "Check the highlighted fields and try again.",
      errors,
    };
  }

  try {
    await updateCaseDecision(caseId, {
      outcome: outcomeValue,
      reviewer,
      reason,
    });
  } catch (error) {
    return {
      message:
        error instanceof Error
          ? error.message
          : "The decision could not be saved. Try again.",
    };
  }

  revalidatePath("/queue");
  revalidatePath(`/queue/${caseId}`);
  revalidatePath(`/cases/${caseId}`);
  revalidatePath("/audit");

  redirect(`/cases/${caseId}`);
}
