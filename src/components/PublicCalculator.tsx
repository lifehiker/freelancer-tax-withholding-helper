"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, Landmark, PiggyBank } from "lucide-react";
import { states } from "@/data/states";
import { calculateSetAside, filingStatusLabel, type FilingStatus, standardDeductionFor } from "@/lib/tax-calculator";
import { currency, percent } from "@/lib/utils";

type Props = {
  initialState?: string;
  compact?: boolean;
};

export function PublicCalculator({ initialState = "CA", compact = false }: Props) {
  const [payment, setPayment] = useState(5000);
  const [annualIncome, setAnnualIncome] = useState(90000);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>("single");
  const [state, setState] = useState(initialState);

  const result = useMemo(
    () =>
      calculateSetAside(
        payment,
        {
          filingStatus,
          state,
          estimatedAnnualDeductions: standardDeductionFor(filingStatus),
        },
        0,
        annualIncome,
      ),
    [annualIncome, filingStatus, payment, state],
  );

  return (
    <div className="card">
      <div className="eyebrow">Free calculator</div>
      <h2>{currency(payment)} payment: set aside {currency(result.total)}</h2>
      <p className="muted">
        Estimated {percent(result.percentage)} for a {filingStatusLabel(filingStatus).toLowerCase()} filer in{" "}
        {states.find((item) => item.code === state)?.name}.
      </p>
      <div className="form">
        <div className="two-grid">
          <div className="field">
            <label htmlFor="payment">Gross payment</label>
            <input id="payment" className="input" type="number" min="0" value={payment} onChange={(event) => setPayment(Number(event.target.value))} />
          </div>
          <div className="field">
            <label htmlFor="annualIncome">Expected annual freelance income</label>
            <input id="annualIncome" className="input" type="number" min="0" value={annualIncome} onChange={(event) => setAnnualIncome(Number(event.target.value))} />
          </div>
        </div>
        <div className="two-grid">
          <div className="field">
            <label htmlFor="filingStatus">Filing status</label>
            <select id="filingStatus" className="select" value={filingStatus} onChange={(event) => setFilingStatus(event.target.value as FilingStatus)}>
              <option value="single">Single</option>
              <option value="married_joint">Married filing jointly</option>
              <option value="married_separate">Married filing separately</option>
              <option value="head">Head of household</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="state">State</label>
            <select id="state" className="select" value={state} onChange={(event) => setState(event.target.value)}>
              {states.map((item) => (
                <option key={item.code} value={item.code}>{item.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 18 }}>
        <div className="result-row">
          <span><Landmark size={16} /> Federal income tax</span>
          <strong>{currency(result.federal)}</strong>
        </div>
        <div className="result-row">
          <span><Calculator size={16} /> Self-employment tax</span>
          <strong>{currency(result.selfEmployment)}</strong>
        </div>
        <div className="result-row">
          <span><PiggyBank size={16} /> State tax estimate</span>
          <strong>{currency(result.state)}</strong>
        </div>
        <div className="result-row">
          <span>Total set-aside</span>
          <strong>{currency(result.total)}</strong>
        </div>
      </div>
      {!compact && (
        <p className="notice">
          This is an estimate for cash-flow planning, not tax advice. Track actual payments and quarterly estimates with a free account.
        </p>
      )}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
        <Link className="button" href="/signup">Track payments</Link>
        <Link className="secondary-button" href="/quarterly-tax-dates">See 2026 due dates</Link>
      </div>
    </div>
  );
}
