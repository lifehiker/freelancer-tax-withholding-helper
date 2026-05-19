import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await requireUser();
  const entries = await prisma.incomeEntry.findMany({ where: { userId: user.id }, orderBy: { receivedAt: "asc" } });
  const rows = [
    ["date", "label", "gross_amount", "federal_set_aside", "self_employment_set_aside", "state_set_aside", "total_set_aside", "transferred"],
    ...entries.map((entry) => [
      entry.receivedAt.toISOString().slice(0, 10),
      entry.label || "",
      entry.amount.toFixed(2),
      entry.federalSetAside.toFixed(2),
      entry.seSetAside.toFixed(2),
      entry.stateSetAside.toFixed(2),
      entry.totalSetAside.toFixed(2),
      String(entry.transferred),
    ]),
  ];
  const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=withholdinghelper-income.csv",
    },
  });
}
