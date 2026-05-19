import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { calculateSetAside, type FilingStatus } from "@/lib/tax-calculator";
import { canAddIncomeEntry } from "@/lib/subscription";

const schema = z.object({
  amount: z.coerce.number().positive(),
  label: z.string().max(100).optional(),
  receivedAt: z.string().optional(),
  transferred: z.boolean().optional(),
});

export async function GET() {
  const user = await requireUser();
  const entries = await prisma.incomeEntry.findMany({ where: { userId: user.id }, orderBy: { receivedAt: "desc" } });
  return NextResponse.json({ entries });
}

export async function POST(request: Request) {
  const user = await requireUser();
  const gate = await canAddIncomeEntry(user.id);
  if (!gate.allowed) {
    return NextResponse.json({ error: "Free accounts include five lifetime income entries.", upgrade: true }, { status: 403 });
  }
  const profile = await prisma.taxProfile.findUnique({ where: { userId: user.id } });
  if (!profile) return NextResponse.json({ error: "Create your tax profile first." }, { status: 400 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter a valid payment amount." }, { status: 400 });
  const yearStart = new Date(new Date().getFullYear(), 0, 1);
  const aggregate = await prisma.incomeEntry.aggregate({
    where: { userId: user.id, receivedAt: { gte: yearStart } },
    _sum: { amount: true },
  });
  const result = calculateSetAside(parsed.data.amount, {
    filingStatus: profile.filingStatus as FilingStatus,
    state: profile.state,
    estimatedAnnualDeductions: profile.estimatedAnnualDeductions,
    priorYearTaxLiability: profile.priorYearTaxLiability,
  }, aggregate._sum.amount || 0);
  const entry = await prisma.incomeEntry.create({
    data: {
      userId: user.id,
      amount: parsed.data.amount,
      label: parsed.data.label,
      receivedAt: parsed.data.receivedAt ? new Date(parsed.data.receivedAt) : new Date(),
      federalSetAside: result.federal,
      stateSetAside: result.state,
      seSetAside: result.selfEmployment,
      totalSetAside: result.total,
      percentage: result.percentage,
      transferred: parsed.data.transferred || false,
    },
  });
  return NextResponse.json({ entry });
}
