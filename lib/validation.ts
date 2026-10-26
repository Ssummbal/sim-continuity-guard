import { normalizeSaudiPhone } from "./phone";
import type {
  AssessmentFieldErrors,
  DecisionFieldErrors,
  RiskInput,
} from "./types";

export interface AssessmentFormValues {
  phoneNumber: string;
  daysInactive: string;
  wasRecycled: boolean;
  linkedAccounts: string;
  recentSimSwap: boolean;
  deviceChanged: boolean;
}

export interface AssessmentValidationResult {
  errors: AssessmentFieldErrors;
  input?: RiskInput;
}

export const emptyAssessmentValues: AssessmentFormValues = {
  phoneNumber: "",
  daysInactive: "",
  wasRecycled: true,
  linkedAccounts: "",
  recentSimSwap: false,
  deviceChanged: false,
};

export function validateAssessmentValues(
  values: AssessmentFormValues,
): AssessmentValidationResult {
  const errors: AssessmentFieldErrors = {};
  const phone = normalizeSaudiPhone(values.phoneNumber);

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = "Enter the mobile number being assessed.";
  } else if (!phone) {
    errors.phoneNumber =
      "Use a Saudi mobile number such as +966 55 123 4567 or 055 123 4567.";
  }

  const daysRaw = values.daysInactive.trim();
  const days = /^\d+$/.test(daysRaw) ? Number(daysRaw) : Number.NaN;
  if (!Number.isInteger(days) || days < 0 || days > 3650) {
    errors.daysInactive =
      "Enter a whole number of days between 0 and 3,650.";
  }

  const linkedRaw = values.linkedAccounts.trim();
  const linked = /^\d+$/.test(linkedRaw) ? Number(linkedRaw) : Number.NaN;
  if (!Number.isInteger(linked) || linked < 0 || linked > 20) {
    errors.linkedAccounts =
      "Enter a whole number of linked accounts between 0 and 20.";
  }

  if (Object.keys(errors).length > 0 || !phone) {
    return { errors };
  }

  return {
    errors,
    input: {
      phoneNumber: phone,
      daysInactive: days,
      wasRecycled: values.wasRecycled,
      linkedAccounts: linked,
      recentSimSwap: values.recentSimSwap,
      deviceChanged: values.deviceChanged,
    },
  };
}

export function formValuesFromFormData(formData: FormData): AssessmentFormValues {
  const getString = (name: string) => {
    const value = formData.get(name);
    return typeof value === "string" ? value : "";
  };

  return {
    phoneNumber: getString("phoneNumber"),
    daysInactive: getString("daysInactive"),
    wasRecycled: formData.get("wasRecycled") === "on",
    linkedAccounts: getString("linkedAccounts"),
    recentSimSwap: formData.get("recentSimSwap") === "on",
    deviceChanged: formData.get("deviceChanged") === "on",
  };
}

export function validateDecisionValues(
  reviewer: string,
  reason: string,
): DecisionFieldErrors {
  const errors: DecisionFieldErrors = {};

  if (reviewer.trim().length < 2) {
    errors.reviewer = "Enter the name of the reviewer making this decision.";
  }

  if (reason.trim().length < 10) {
    errors.reason = "Give a reason of at least 10 characters.";
  }

  return errors;
}
