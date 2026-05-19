import { prisma } from "@/lib/prisma";

export async function getUserSubscriptionStatus(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionStatus: true },
  });
  return user?.subscriptionStatus || "free";
}

export async function canAddIncomeEntry(userId: string) {
  const status = await getUserSubscriptionStatus(userId);
  if (status === "active" || status === "trialing") return { allowed: true, remaining: Infinity };
  const count = await prisma.incomeEntry.count({ where: { userId } });
  return { allowed: count < 5, remaining: Math.max(0, 5 - count) };
}
