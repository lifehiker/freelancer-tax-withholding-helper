"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { states } from "@/data/states";
import { standardDeductionFor, type FilingStatus } from "@/lib/tax-calculator";

type Profile = {
  filingStatus: string;
  state: string;
  estimatedAnnualDeductions: number;
  priorYearTaxLiability: number | null;
  remindersEnabled: boolean;
} | null;

export function OnboardingForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [status, setStatus] = useState<FilingStatus>((profile?.filingStatus as FilingStatus) || "single");
  const [state, setState] = useState(profile?.state || "CA");
  const [deductions, setDeductions] = useState(profile?.estimatedAnnualDeductions || standardDeductionFor(status));
  const [prior, setPrior] = useState(profile?.priorYearTaxLiability || 0);
  const [reminders, setReminders] = useState(profile?.remindersEnabled || false);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function save() {
    setError("");
    startTransition(async () => {
      const response = await fetch("/api/tax-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filingStatus: status,
          state,
          estimatedAnnualDeductions: deductions,
          priorYearTaxLiability: prior || null,
          remindersEnabled: reminders,
        }),
      });
      if (!response.ok) {
        setError("Could not save profile.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="card form" style={{ maxWidth: 720 }}>
      <div className="field">
        <label htmlFor="filing">Filing status</label>
        <select
          id="filing"
          className="select"
          value={status}
          onChange={(event) => {
            const next = event.target.value as FilingStatus;
            setStatus(next);
            setDeductions(standardDeductionFor(next));
          }}
        >
          <option value="single">Single</option>
          <option value="married_joint">Married filing jointly</option>
          <option value="married_separate">Married filing separately</option>
          <option value="head">Head of household</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="state">State</label>
        <select id="state" className="select" value={state} onChange={(event) => setState(event.target.value)}>
          {states.map((item) => <option key={item.code} value={item.code}>{item.name}</option>)}
        </select>
      </div>
      <div className="two-grid">
        <div className="field">
          <label htmlFor="deductions">Estimated annual deductions</label>
          <input id="deductions" className="input" type="number" value={deductions} onChange={(event) => setDeductions(Number(event.target.value))} />
        </div>
        <div className="field">
          <label htmlFor="prior">Prior-year total tax liability</label>
          <input id="prior" className="input" type="number" value={prior} onChange={(event) => setPrior(Number(event.target.value))} />
        </div>
      </div>
      <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <input type="checkbox" checked={reminders} onChange={(event) => setReminders(event.target.checked)} />
        Send quarterly due-date reminders when email is configured
      </label>
      {error && <p className="danger">{error}</p>}
      <button className="button" onClick={save} disabled={pending}>{pending ? "Saving..." : "Save profile"}</button>
    </div>
  );
}
