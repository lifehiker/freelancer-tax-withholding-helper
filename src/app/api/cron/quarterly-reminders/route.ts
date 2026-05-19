import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { daysUntilDue, nextDueDate } from "@/lib/tax-calculator";

export async function POST() {
  const days = daysUntilDue();
  const shouldSendQuarterly = days === 14 || days === 3;
  const now = new Date();
  const thirtyOneDaysAgo = new Date(now.getTime() - 31 * 86400000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);

  const reminderUsers = await prisma.user.findMany({
    where: { subscriptionStatus: "active", taxProfile: { remindersEnabled: true } },
    include: { taxProfile: true, incomeEntries: { orderBy: { receivedAt: "desc" }, take: 1 } },
  });
  const inactiveUsers = reminderUsers.filter((user) => {
    const lastActivity = user.incomeEntries[0]?.receivedAt ?? user.createdAt;
    return lastActivity >= thirtyOneDaysAgo && lastActivity <= thirtyDaysAgo;
  });
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      wouldSendQuarterly: shouldSendQuarterly ? reminderUsers.length : 0,
      wouldSendInactive: inactiveUsers.length,
      reason: shouldSendQuarterly ? undefined : "No quarterly reminder window today.",
    });
  }
  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const due = nextDueDate();
  const from = process.env.EMAIL_FROM || "WithholdingHelper <noreply@example.com>";
  const quarterlySends = shouldSendQuarterly
    ? reminderUsers.map((user) => resend.emails.send({
        from,
        to: user.email,
        subject: `Estimated tax payment due in ${days} days`,
        html: `<p>Your Q${due.quarter} estimated tax payment is due ${due.due}.</p><p>Log in to WithholdingHelper to review your latest estimate.</p>`,
      }))
    : [];
  const inactiveSends = inactiveUsers.map((user) => resend.emails.send({
    from,
    to: user.email,
    subject: "Need to log a freelance payment?",
    html: "<p>It has been about 30 days since your last logged payment. If income arrived, log it now so your tax savings estimate stays current.</p>",
  }));
  await Promise.all([...quarterlySends, ...inactiveSends]);
  return NextResponse.json({ ok: true, sentQuarterly: quarterlySends.length, sentInactive: inactiveSends.length });
}
