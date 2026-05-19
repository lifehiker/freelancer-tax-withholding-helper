import type { Metadata } from "next";
import { estimatedTaxDueDates } from "@/lib/tax-calculator";
import { WaitlistForm } from "@/components/WaitlistForm";

export const metadata: Metadata = {
  title: "2026 Quarterly Estimated Tax Dates",
  description: "2026 IRS estimated tax payment dates for freelancers and independent contractors.",
};

export default function QuarterlyTaxDatesPage() {
  return (
    <main className="shell section">
      <div className="eyebrow">2026 tax year</div>
      <h1>Quarterly estimated tax dates</h1>
      <p className="lead">For the 2026 tax year, IRS Publication 505 lists the individual estimated tax deadlines as April 15, June 15, September 15, and January 15 of the following year.</p>
      <div className="two-grid">
        <div className="card">
          {estimatedTaxDueDates.map((item) => (
            <div className="table-row" key={item.quarter}>
              <span>Q{item.quarter}: {item.period}</span>
              <strong>{item.due}</strong>
            </div>
          ))}
        </div>
        <WaitlistForm source="quarterly-tax-dates" />
      </div>
    </main>
  );
}
