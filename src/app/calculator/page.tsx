import type { Metadata } from "next";
import { PublicCalculator } from "@/components/PublicCalculator";

export const metadata: Metadata = {
  title: "Self Employment Tax Withholding Calculator",
  description: "Calculate how much to set aside from each freelance payment for federal income tax, self-employment tax, and state tax.",
};

export default function CalculatorPage() {
  return (
    <main className="shell section">
      <div className="eyebrow">No account required</div>
      <h1>Freelance tax set-aside calculator</h1>
      <p className="lead">Enter one payment and your rough annual income to get a practical set-aside estimate for federal, self-employment, and state taxes.</p>
      <PublicCalculator />
    </main>
  );
}
