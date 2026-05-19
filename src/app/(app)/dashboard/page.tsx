import Link from "next/link";
import { PaymentLoggerDialog } from "@/components/PaymentLoggerDialog";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { currency } from "@/lib/utils";
import { daysUntilDue, nextDueDate } from "@/lib/tax-calculator";

export default async function DashboardPage() {
  const user = await requireUser();
  const [profile, entries, subscription] = await Promise.all([
    prisma.taxProfile.findUnique({ where: { userId: user.id } }),
    prisma.incomeEntry.findMany({ where: { userId: user.id }, orderBy: { receivedAt: "desc" } }),
    prisma.user.findUnique({ where: { id: user.id }, select: { subscriptionStatus: true } }),
  ]);

  if (!profile) {
    return (
      <div className="card">
        <h1>Create your tax profile</h1>
        <p className="lead">Add your filing status and state before logging payments.</p>
        <Link className="button" href="/onboard">Set up profile</Link>
      </div>
    );
  }

  const income = entries.reduce((sum, entry) => sum + entry.amount, 0);
  const setAside = entries.reduce((sum, entry) => sum + entry.totalSetAside, 0);
  const transferred = entries.filter((entry) => entry.transferred).reduce((sum, entry) => sum + entry.totalSetAside, 0);
  const due = nextDueDate();
  const isFree = subscription?.subscriptionStatus !== "active";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div className="eyebrow">Dashboard</div>
          <h1>Tax savings command center</h1>
        </div>
        <PaymentLoggerDialog />
      </div>
      {isFree && entries.length >= 3 && (
        <p className="notice">Free accounts include five income entries. You have used {entries.length}/5. <Link href="/pricing">Upgrade for unlimited tracking.</Link></p>
      )}
      <div className="grid">
        <div className="card"><span className="muted">YTD income</span><div className="metric">{currency(income)}</div></div>
        <div className="card"><span className="muted">Recommended set-aside</span><div className="metric">{currency(setAside)}</div></div>
        <div className="card"><span className="muted">Savings gap</span><div className="metric">{currency(Math.max(0, setAside - transferred))}</div></div>
      </div>
      <div className="two-grid section">
        <div className="card">
          <h2>Next quarterly payment</h2>
          <p className="metric">{due.due}</p>
          <p className="muted">{daysUntilDue()} days remaining for Q{due.quarter}. <Link href="/dashboard/quarterly">View estimate</Link>.</p>
        </div>
        <div className="card">
          <h2>Recent payments</h2>
          {entries.slice(0, 6).map((entry) => (
            <div className="table-row" key={entry.id}>
              <span>{entry.label || "Freelance payment"}<br /><small className="muted">{entry.receivedAt.toLocaleDateString()}</small></span>
              <strong>{currency(entry.totalSetAside)}</strong>
            </div>
          ))}
          {entries.length === 0 && <p className="muted">No payments yet. Use the button above when money lands.</p>}
        </div>
      </div>
    </div>
  );
}
