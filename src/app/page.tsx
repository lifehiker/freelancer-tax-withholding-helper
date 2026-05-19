import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { CheckCircle2, Clock, FileDown, ShieldCheck } from "lucide-react";
import { PublicCalculator } from "@/components/PublicCalculator";

export default function HomePage() {
  return (
    <main>
      <section className="shell hero">
        <div>
          <div className="eyebrow">For US freelancers and contractors</div>
          <h1>Know what to move to tax savings after every payment.</h1>
          <p className="lead">
            WithholdingHelper turns irregular freelance income into one clear set-aside number, then keeps a running quarterly estimate without bank linking or bookkeeping bloat.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 24 }}>
            <Link className="button" href="/signup">Start free</Link>
            <Link className="secondary-button" href="/calculator">Use the calculator</Link>
          </div>
        </div>
        <PublicCalculator compact />
      </section>
      <section className="section">
        <div className="shell grid">
          {([
            [CheckCircle2, "Per-payment clarity", "Log a payment and see federal, state, and self-employment tax broken out immediately."],
            [Clock, "Quarterly estimates", "See the next IRS due date, countdown, and estimated payment using your logged income."],
            [FileDown, "CPA-ready export", "Export payment history with calculated set-asides when filing season arrives."],
          ] as Array<[LucideIcon, string, string]>).map(([Icon, title, copy]) => (
            <div className="card" key={String(title)}>
              <Icon size={24} color="#176b58" />
              <h3>{title}</h3>
              <p className="muted">{copy}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section">
        <div className="shell two-grid">
          <div>
            <h2>No bank links. No invoice system. No spreadsheet maintenance.</h2>
            <p className="lead">The workflow is intentionally narrow: set up your profile, log each gross payment, move the recommended amount, and keep an eye on quarterly payments.</p>
          </div>
          <div className="card">
            <ShieldCheck color="#176b58" />
            <h3>Built around safe fallbacks</h3>
            <p className="muted">The app runs locally with SQLite, credential auth, and guarded Stripe and email routes so missing production keys never crash the build.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
