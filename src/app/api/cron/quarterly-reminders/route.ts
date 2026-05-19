import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { daysUntilDue, nextDueDate } from "@/lib/tax-calculator";

export async function POST() {
  const days = daysUntilDue();
  if (days !== 14 && days !== 3) {
    return NextResponse.json({ ok: true, sent: 0, reason: "No reminder window today." });
  }
  const users = await prisma.user.findMany({
    where: { subscriptionStatus: "active", taxProfile: { remindersEnabled: true } },
    include: { taxProfile: true },
  });
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ ok: true, dryRun: true, wouldSend: users.length });
  }
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const due = nextDueDate();
  await Promise.all(users.map((user) => resend.emails.send({
    from: process.env.EMAIL_FROM || "WithholdingHelper <noreply@example.com>",
    to: user.email,
    subject: `Estimated tax payment due in ${days} days`,
    html: `<p>Your Q${due.quarter} estimated tax payment is due ${due.due}.</p><p>Log in to WithholdingHelper to review your latest estimate.</p>`,
  })));
  return NextResponse.json({ ok: true, sent: users.length });
}
