import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";
import { standardDeductionFor, type FilingStatus } from "@/lib/tax-calculator";

const schema = z.object({
  filingStatus: z.enum(["single", "married_joint", "married_separate", "head"]),
  state: z.string().min(2),
  estimatedAnnualDeductions: z.coerce.number().min(0).optional(),
  priorYearTaxLiability: z.coerce.number().min(0).optional().nullable(),
  remindersEnabled: z.boolean().optional(),
});

export async function GET() {
  const user = await requireUser();
  const profile = await prisma.taxProfile.findUnique({ where: { userId: user.id } });
  return NextResponse.json({ profile });
}

export async function POST(request: Request) {
  const user = await requireUser();
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid tax profile." }, { status: 400 });
  const deductions = parsed.data.estimatedAnnualDeductions || standardDeductionFor(parsed.data.filingStatus as FilingStatus);
  const profile = await prisma.taxProfile.upsert({
    where: { userId: user.id },
    update: { ...parsed.data, estimatedAnnualDeductions: deductions },
    create: { ...parsed.data, estimatedAnnualDeductions: deductions, userId: user.id },
  });
  return NextResponse.json({ profile });
}
