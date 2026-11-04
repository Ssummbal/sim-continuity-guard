"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";
import { submitAssessment } from "@/app/assess/actions";
import { showToast } from "@/lib/toast";
import type {
  AssessmentActionState,
  AssessmentFieldErrors,
} from "@/lib/types";
import {
  emptyAssessmentValues,
  validateAssessmentValues,
  type AssessmentFormValues,
} from "@/lib/validation";

const presets: Array<{
  label: string;
  values: AssessmentFormValues;
}> = [
  {
    label: "Low-risk example",
    values: {
      phoneNumber: "+966 50 111 2233",
      daysInactive: "20",
      wasRecycled: false,
      linkedAccounts: "1",
      recentSimSwap: false,
      deviceChanged: false,
    },
  },
  {
    label: "Medium-risk example",
    values: {
      phoneNumber: "+966 54 118 9036",
      daysInactive: "210",
      wasRecycled: true,
      linkedAccounts: "2",
      recentSimSwap: false,
      deviceChanged: false,
    },
  },
  {
    label: "High-risk example",
    values: {
      phoneNumber: "+966 50 774 3628",
      daysInactive: "800",
      wasRecycled: true,
      linkedAccounts: "6",
      recentSimSwap: true,
      deviceChanged: true,
    },
  },
];

const initialState: AssessmentActionState = {};

export function AssessForm() {
  const [values, setValues] =
    useState<AssessmentFormValues>(emptyAssessmentValues);
  const [clientErrors, setClientErrors] = useState<AssessmentFieldErrors>({});
  const [state, formAction, pending] = useActionState(
    submitAssessment,
    initialState,
  );

  const errors: AssessmentFieldErrors = {
    ...state.errors,
    ...clientErrors,
  };
  const errorMessages = Array.from(
    new Set(
      Object.values(errors).filter(
        (message): message is string => Boolean(message),
      ),
    ),
  );

  useEffect(() => {
    if (state.message) {
      showToast(state.message, "error");
    }
  }, [state.message]);

  function updateField<K extends keyof AssessmentFormValues>(
    field: K,
    value: AssessmentFormValues[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));

    if (
      field === "phoneNumber" ||
      field === "daysInactive" ||
      field === "linkedAccounts"
    ) {
      setClientErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  function applyPreset(preset: AssessmentFormValues) {
    setValues(preset);
    setClientErrors({});
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const result = validateAssessmentValues(values);

    if (Object.keys(result.errors).length > 0) {
      event.preventDefault();
      setClientErrors(result.errors);
      showToast("Please correct the highlighted fields.", "error");
      return;
    }

    setClientErrors({});
  }

  return (
    <form
      action={formAction}
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="scenario-heading"
      className="card p-6 sm:p-8"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2
            id="scenario-heading"
            className="font-serif text-2xl font-semibold tracking-tight"
          >
            Scenario details
          </h2>
          <p className="mt-1 max-w-lg text-sm leading-relaxed text-muted">
            Enter the signals available at reassignment. The assessment is
            deterministic and every triggered signal will be shown to the
            reviewer.
          </p>
        </div>
        <span className="rounded-full border border-line bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-muted">
          Synthetic data
        </span>
      </div>

      <div className="mt-6 rounded-[var(--radius-lg)] border border-ghost-strong/15 bg-ghost-soft/50 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ghost-strong">
          Quick presets
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset.values)}
              className="rounded-full border border-line bg-surface px-3 py-1.5 text-xs font-semibold text-muted transition-colors hover:border-accent/40 hover:text-accent"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {errorMessages.length > 0 || state.message ? (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-risk-high/30 bg-risk-high-soft px-4 py-3 text-sm text-risk-high"
        >
          <p className="font-semibold">
            {state.message ?? "Please correct the highlighted fields."}
          </p>
          {errorMessages.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs leading-relaxed">
              {errorMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="phoneNumber" className="field-label">
            Mobile number{" "}
            <span className="text-risk-high" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            inputMode="tel"
            autoComplete="off"
            value={values.phoneNumber}
            onChange={(event) =>
              updateField("phoneNumber", event.target.value)
            }
            placeholder="+966 55 123 4567 or 055 123 4567"
            aria-required="true"
            aria-invalid={Boolean(errors.phoneNumber)}
            aria-describedby={
              errors.phoneNumber ? "phoneNumber-error" : "phoneNumber-hint"
            }
            className="input mt-2"
          />
          {errors.phoneNumber ? (
            <p id="phoneNumber-error" className="field-error">
              {errors.phoneNumber}
            </p>
          ) : (
            <p id="phoneNumber-hint" className="field-hint">
              Saudi mobile numbers only, in +966 or local 05X format.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="daysInactive" className="field-label">
            Days inactive before reassignment{" "}
            <span className="text-risk-high" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="daysInactive"
            name="daysInactive"
            type="number"
            inputMode="numeric"
            min={0}
            max={3650}
            step={1}
            value={values.daysInactive}
            onChange={(event) =>
              updateField("daysInactive", event.target.value)
            }
            placeholder="210"
            aria-required="true"
            aria-invalid={Boolean(errors.daysInactive)}
            aria-describedby={
              errors.daysInactive ? "daysInactive-error" : "daysInactive-hint"
            }
            className="input mt-2"
          />
          {errors.daysInactive ? (
            <p id="daysInactive-error" className="field-error">
              {errors.daysInactive}
            </p>
          ) : (
            <p id="daysInactive-hint" className="field-hint">
              How long the number sat dormant before it was reassigned.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="linkedAccounts" className="field-label">
            Linked accounts{" "}
            <span className="text-risk-high" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="linkedAccounts"
            name="linkedAccounts"
            type="number"
            inputMode="numeric"
            min={0}
            max={20}
            step={1}
            value={values.linkedAccounts}
            onChange={(event) =>
              updateField("linkedAccounts", event.target.value)
            }
            placeholder="3"
            aria-required="true"
            aria-invalid={Boolean(errors.linkedAccounts)}
            aria-describedby={
              errors.linkedAccounts
                ? "linkedAccounts-error"
                : "linkedAccounts-hint"
            }
            className="input mt-2"
          />
          {errors.linkedAccounts ? (
            <p id="linkedAccounts-error" className="field-error">
              {errors.linkedAccounts}
            </p>
          ) : (
            <p id="linkedAccounts-hint" className="field-hint">
              Banking, wallet, and government services that still use this
              number.
            </p>
          )}
        </div>
      </div>

      <fieldset className="mt-8 rounded-xl border border-line p-5">
        <legend className="px-2 text-sm font-semibold">Continuity signals</legend>
        <p className="text-xs leading-relaxed text-muted">
          Tick every signal that is true for this reassignment.
        </p>
        <div className="mt-4 space-y-4">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="wasRecycled"
              checked={values.wasRecycled}
              onChange={(event) =>
                updateField("wasRecycled", event.target.checked)
              }
              className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
            />
            <span>
              <span className="block text-sm font-medium">
                The number was recycled
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                It previously belonged to another subscriber.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="recentSimSwap"
              checked={values.recentSimSwap}
              onChange={(event) =>
                updateField("recentSimSwap", event.target.checked)
              }
              className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
            />
            <span>
              <span className="block text-sm font-medium">
                SIM swap in the last 30 days
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                A carrier-side SIM swap was recorded recently.
              </span>
            </span>
          </label>

          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="deviceChanged"
              checked={values.deviceChanged}
              onChange={(event) =>
                updateField("deviceChanged", event.target.checked)
              }
              className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
            />
            <span>
              <span className="block text-sm font-medium">
                The device changed
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-muted">
                The handset associated with the number changed during
                reassignment.
              </span>
            </span>
          </label>
        </div>
      </fieldset>

      <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-sm text-xs leading-relaxed text-muted">
          Low scores auto-clear. Medium and high scores are sent to a named
          human reviewer.
        </p>
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className="btn-primary min-w-44"
        >
          {pending ? "Assessing…" : "Run assessment"}
          {pending ? null : <span aria-hidden="true">→</span>}
        </button>
      </div>
    </form>
  );
}
