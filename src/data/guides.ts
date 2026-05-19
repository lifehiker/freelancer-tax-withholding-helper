export const guides = [
  {
    slug: "how-much-to-set-aside-freelance-taxes",
    title: "How Much to Set Aside for Freelance Taxes in 2026",
    description: "A practical framework for federal income tax, self-employment tax, and state tax.",
    body: [
      "Many freelancers use a rough 25% to 30% rule. That can be close for some people and dangerously low for others because self-employment tax, filing status, deductions, and state taxes all change the answer.",
      "A better workflow is to estimate your annual tax rate, apply it to every payment as it arrives, and then review quarterly payments before each IRS deadline.",
      "WithholdingHelper focuses on that cash-flow moment: payment received, calculation shown, money moved."
    ],
  },
  {
    slug: "first-year-freelancer-taxes",
    title: "Quarterly Estimated Tax for First-Year Freelancers",
    description: "What new freelancers need to know before the first quarterly deadline.",
    body: [
      "When taxes are no longer withheld from a paycheck, you generally need to make estimated payments during the year if you expect to owe enough at filing.",
      "The first year is hard because income is irregular and there is no habit yet. Logging every payment and moving tax savings immediately reduces the chance that tax money gets spent as operating cash.",
      "Prior-year safe harbor rules can help, but first-year freelancers should still watch current-year income closely."
    ],
  },
  {
    slug: "self-employment-tax-explained",
    title: "Self-Employment Tax Explained",
    description: "Why freelancers often owe more than expected even before income tax.",
    body: [
      "Self-employment tax covers Social Security and Medicare taxes that are normally split between employee and employer. Independent contractors pay both sides through Schedule SE.",
      "The common headline rate is 15.3% on 92.35% of net self-employment earnings, with additional Medicare tax at higher income levels.",
      "That tax is separate from federal income tax and state tax, which is why a simple income-tax-only estimate can come up short."
    ],
  },
  {
    slug: "annualized-income-installment-method",
    title: "Annualized Income Installment Method for Irregular Freelance Income",
    description: "How variable earners can estimate quarterly payments based on when income actually arrived.",
    body: [
      "Freelancers often have uneven income: a large project closes in one quarter and the next quarter is quiet. The annualized income installment method can reduce mismatch between income timing and required estimated payments.",
      "The method generally uses year-to-date income through each period to compute a period-specific required installment.",
      "WithholdingHelper includes an annualized toggle as a planning estimate and reminds users to keep records for Form 2210 Schedule AI when needed."
    ],
  },
  {
    slug: "quarterly-tax-penalty-calculator",
    title: "Freelancer Quarterly Tax Penalty Calculator",
    description: "How to think about underpayment risk and catch up before the next deadline.",
    body: [
      "Underpayment penalties are calculated by period, so catching up late may not erase every issue, but it can reduce future exposure.",
      "The practical move is to estimate the current annual requirement, compare it with prior-year safe harbor, and pay the next installment on time.",
      "This app is built to make that estimate visible before the deadline instead of after filing season."
    ],
  },
];

export function findGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
