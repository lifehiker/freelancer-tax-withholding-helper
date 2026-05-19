"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { currency, percent } from "@/lib/utils";

type CreatedEntry = {
  id: string;
  federalSetAside: number;
  stateSetAside: number;
  seSetAside: number;
  totalSetAside: number;
  percentage: number;
};

export function PaymentLoggerDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(2500);
  const [label, setLabel] = useState("");
  const [entry, setEntry] = useState<CreatedEntry | null>(null);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    setError("");
    startTransition(async () => {
      const response = await fetch("/api/income-entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, label }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body.error || "Could not save payment.");
        return;
      }
      setEntry(body.entry);
      router.refresh();
    });
  }

  function markTransferred() {
    if (!entry) return;
    startTransition(async () => {
      await fetch(`/api/income-entries/${entry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transferred: true }),
      });
      setOpen(false);
      setEntry(null);
      router.refresh();
    });
  }

  return (
    <>
      <button className="button" onClick={() => setOpen(true)}><Plus size={18} /> I just got paid</button>
      {open && (
        <div className="dialog-backdrop">
          <div className="card dialog">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div className="eyebrow">Payment logger</div>
                <h2>I just got paid</h2>
              </div>
              <button className="ghost-button" aria-label="Close" onClick={() => setOpen(false)}><X size={18} /></button>
            </div>
            {!entry ? (
              <div className="form">
                <div className="field">
                  <label htmlFor="amount">Gross payment amount</label>
                  <input id="amount" className="input" type="number" min="0" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
                </div>
                <div className="field">
                  <label htmlFor="label">Label</label>
                  <input id="label" className="input" value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Client or project" />
                </div>
                {error && <p className="danger">{error}</p>}
                <button className="button" disabled={pending} onClick={submit}>{pending ? "Calculating..." : "Calculate set-aside"}</button>
              </div>
            ) : (
              <div>
                <div className="result-row"><span>Federal income tax</span><strong>{currency(entry.federalSetAside)}</strong></div>
                <div className="result-row"><span>Self-employment tax</span><strong>{currency(entry.seSetAside)}</strong></div>
                <div className="result-row"><span>State tax</span><strong>{currency(entry.stateSetAside)}</strong></div>
                <div className="result-row"><span>Total set-aside ({percent(entry.percentage)})</span><strong>{currency(entry.totalSetAside)}</strong></div>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 16 }}>
                  <button className="button" onClick={markTransferred}>Mark transferred to savings</button>
                  <button className="secondary-button" onClick={() => setOpen(false)}>I&apos;ll do it later</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
