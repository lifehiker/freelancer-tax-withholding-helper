import { FileDown } from "lucide-react";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export default async function ExportPage() {
  const user = await requireUser();
  const count = await prisma.incomeEntry.count({ where: { userId: user.id } });
  return (
    <div className="card" style={{ maxWidth: 720 }}>
      <FileDown color="#176b58" />
      <h1>Export for your CPA</h1>
      <p className="lead">Download a CSV with every logged payment, calculated tax breakdown, total set-aside, and transfer status.</p>
      <p className="muted">{count} income entries ready.</p>
      <a className="button" href="/api/export/income">Download CSV</a>
    </div>
  );
}
