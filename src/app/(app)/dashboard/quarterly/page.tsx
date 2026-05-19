import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { quarterlyPlan, type FilingStatus } from "@/lib/tax-calculator";
import { currency } from "@/lib/utils";

export default async function QuarterlyPage({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const user = await requireUser();
  const query = await searchParams;
  const [profile, entries] = await Promise.all([
    prisma.taxProfile.findUnique({ where: { userId: user.id } }),
    prisma.incomeEntry.findMany({ where: { userId: user.id } }),
  ]);
  if (!profile) return <p className="notice">Create your tax profile first.</p>;
  const income = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const mode = query.mode === "annualized" ? "annualized" : "standard";
  const plan = quarterlyPlan(income, {
    filingStatus: profile.filingStatus as FilingStatus,
    state: profile.state,
    estimatedAnnualDeductions: profile.estimatedAnnualDeductions,
    priorYearTaxLiability: profile.priorYearTaxLiability,
  }, mode);

  return (
    <div>
      <div className="eyebrow">Quarterly estimator</div>
      <h1>Estimated tax payments</h1>
      <p className="lead">Based on {currency(income)} of logged income. Toggle annualized mode for uneven income timing.</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "18px 0" }}>
        <a className={mode === "standard" ? "button" : "secondary-button"} href="/dashboard/quarterly?mode=standard">Standard</a>
        <a className={mode === "annualized" ? "button" : "secondary-button"} href="/dashboard/quarterly?mode=annualized">Annualized</a>
      </div>
      <div className="grid">
        {plan.map((item) => (
          <div className="card" key={item.quarter}>
            <div className="eyebrow">Q{item.quarter}</div>
            <h2>{currency(item.amount)}</h2>
            <p className="muted">{item.period}<br />Due {item.due}</p>
            <p className="muted">{item.method}</p>
            <a className="secondary-button" href="https://www.irs.gov/payments" target="_blank" rel="noreferrer">Pay IRS</a>
          </div>
        ))}
      </div>
      <p className="notice">If you use the annualized income installment method, keep records and attach Form 2210 Schedule AI when required.</p>
    </div>
  );
}
