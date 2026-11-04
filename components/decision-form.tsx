"use client";

import { useActionState, useEffect, useState, type FormEvent } from "react";
import { submitDecision } from "@/app/queue/[id]/actions";
import { showToast } from "@/lib/toast";
import type { DecisionActionState, DecisionFieldErrors } from "@/lib/types";
import { validateDecisionValues } from "@/lib/validation";

const initialState: DecisionActionState = {};

export function DecisionForm({
  caseId,
  defaultReviewer = "Noura Al-Harbi",
}: {
  caseId: string;
  defaultReviewer?: string;
}) {
  const [reviewer, setReviewer] = useState(defaultReviewer);
  const [reason, setReason] = useState("");
  const [clientErrors, setClientErrors] = useState<DecisionFieldErrors>({});
  const [state, formAction, pending] = useActionState(
    submitDecision,
    initialState,
  );

  const errors: DecisionFieldErrors = {
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const result = validateDecisionValues(reviewer, reason);

    if (Object.keys(result).length > 0) {
      event.preventDefault();
      setClientErrors(result);
      showToast("Please correct the highlighted fields.", "error");
      return;
    }

    setClientErrors({});
  }

  return (
    <section
      className="card p-6"
      aria-labelledby="decision-heading"
    >
      <p className="eyebrow">Human decision</p>
      <h2
        id="decision-heading"
        className="mt-2 font-serif text-2xl font-semibold tracking-tight"
      >
        Record a decision
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        The score is advisory. Your written reason is stored verbatim in the
        audit log.
      </p>

      <p className="sr-only" role="status">
        {pending ? "Saving decision" : ""}
      </p>

      {errorMessages.length > 0 || state.message ? (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-risk-high/30 bg-risk-high-soft px-3.5 py-3 text-sm text-risk-high"
        >
          <p className="font-semibold">
            {state.message ?? "Please correct the highlighted fields."}
          </p>
          {errorMessages.length > 0 ? (
            <ul className="mt-1.5 list-disc space-y-1 pl-5 text-xs leading-relaxed">
              {errorMessages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <form action={formAction} onSubmit={handleSubmit} noValidate>
        <input type="hidden" name="caseId" value={caseId} />

        <div className="mt-5">
          <label htmlFor="reviewer" className="field-label">
            Reviewer{" "}
            <span className="text-risk-high" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            id="reviewer"
            name="reviewer"
            type="text"
            autoComplete="name"
            aria-required="true"
            value={reviewer}
            onChange={(event) => {
              setReviewer(event.target.value);
              setClientErrors((current) => ({
                ...current,
                reviewer: undefined,
              }));
            }}
            aria-invalid={Boolean(errors.reviewer)}
            aria-describedby={
              errors.reviewer ? "reviewer-error" : "reviewer-hint"
            }
            className="input mt-2"
          />
          {errors.reviewer ? (
            <p id="reviewer-error" className="field-error">
              {errors.reviewer}
            </p>
          ) : (
            <p id="reviewer-hint" className="field-hint">
              The name attached to this decision in the audit trail.
            </p>
          )}
        </div>

        <div className="mt-5">
          <label htmlFor="reason" className="field-label">
            Reason{" "}
            <span className="text-risk-high" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(required)</span>
          </label>
          <textarea
            id="reason"
            name="reason"
            rows={5}
            aria-required="true"
            value={reason}
            onChange={(event) => {
              setReason(event.target.value);
              setClientErrors((current) => ({
                ...current,
                reason: undefined,
              }));
            }}
            aria-invalid={Boolean(errors.reason)}
            aria-describedby={errors.reason ? "reason-error" : "reason-hint"}
            className="textarea mt-2"
            placeholder="State what you verified and why this is the right outcome."
          />
          {errors.reason ? (
            <p id="reason-error" className="field-error">
              {errors.reason}
            </p>
          ) : (
            <p id="reason-hint" className="field-hint">
              Minimum 10 characters. Be specific: the audit log keeps this
              text.
            </p>
          )}
        </div>

        <div className="mt-6 space-y-2 border-t border-line pt-5">
          <button
            type="submit"
            name="outcome"
            value="approved"
            disabled={pending}
            className="btn-primary w-full"
          >
            Approve case
          </button>
          <button
            type="submit"
            name="outcome"
            value="rejected"
            disabled={pending}
            className="btn-danger w-full"
          >
            Reject case
          </button>
          <button
            type="submit"
            name="outcome"
            value="more_info"
            disabled={pending}
            className="btn-secondary w-full"
          >
            Request more information
          </button>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-muted">
          Decisions are final for this prototype. The case status and audit
          log update together.
        </p>
      </form>
    </section>
  );
}
