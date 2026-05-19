import { OnboardingForm } from "@/components/OnboardingForm";
import { requireUser } from "@/lib/auth-helpers";
import { prisma } from "@/lib/prisma";

export default async function OnboardPage() {
  const user = await requireUser();
  const profile = await prisma.taxProfile.findUnique({ where: { userId: user.id } });
  return (
    <div>
      <div className="eyebrow">Tax profile</div>
      <h1>Set up your withholding profile</h1>
      <p className="lead">This takes one screen: filing status, state, deductions, and optional prior-year liability for safe harbor planning.</p>
      <OnboardingForm profile={profile} />
    </div>
  );
}
