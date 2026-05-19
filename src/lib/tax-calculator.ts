import { findState } from "@/data/states";

export type FilingStatus = "single" | "married_joint" | "married_separate" | "head";

export type TaxProfileInput = {
  filingStatus: FilingStatus;
  state: string;
  estimatedAnnualDeductions?: number;
  priorYearTaxLiability?: number | null;
};

export type SetAsideResult = {
  federal: number;
  state: number;
  selfEmployment: number;
  total: number;
  percentage: number;
  annualTaxEstimate: number;
};

const standardDeductions: Record<FilingStatus, number> = {
  single: 16100,
  married_joint: 32200,
  married_separate: 16100,
  head: 24150,
};

const brackets: Record<FilingStatus, Array<[number, number]>> = {
  single: [
    [0, 0.1],
    [11925, 0.12],
    [48475, 0.22],
    [103350, 0.24],
    [197300, 0.32],
    [250525, 0.35],
    [626350, 0.37],
  ],
  married_joint: [
    [0, 0.1],
    [23850, 0.12],
    [96950, 0.22],
    [206700, 0.24],
    [394600, 0.32],
    [501050, 0.35],
    [751600, 0.37],
  ],
  married_separate: [
    [0, 0.1],
    [11925, 0.12],
    [48475, 0.22],
    [103350, 0.24],
    [197300, 0.32],
    [250525, 0.35],
    [375800, 0.37],
  ],
  head: [
    [0, 0.1],
    [17000, 0.12],
    [64850, 0.22],
    [103350, 0.24],
    [197300, 0.32],
    [250500, 0.35],
    [626350, 0.37],
  ],
};

export function standardDeductionFor(status: FilingStatus) {
  return standardDeductions[status];
}

export function calculateFederalIncomeTax(annualIncome: number, filingStatus: FilingStatus, deductions?: number) {
  const taxable = Math.max(0, annualIncome - (deductions || standardDeductionFor(filingStatus)));
  const table = brackets[filingStatus];
  let tax = 0;

  for (let i = 0; i < table.length; i += 1) {
    const [floor, rate] = table[i];
    const next = table[i + 1]?.[0] ?? Infinity;
    if (taxable > floor) {
      tax += (Math.min(taxable, next) - floor) * rate;
    }
  }

  return tax;
}

export function calculateSelfEmploymentTax(netIncome: number) {
  const taxableSeIncome = Math.max(0, netIncome) * 0.9235;
  const socialSecurityWageBase = 176100;
  const socialSecurity = Math.min(taxableSeIncome, socialSecurityWageBase) * 0.124;
  const medicare = taxableSeIncome * 0.029;
  const additionalMedicare = Math.max(0, taxableSeIncome - 200000) * 0.009;
  const tax = socialSecurity + medicare + additionalMedicare;
  return { tax, deductibleHalf: tax / 2 };
}

export function calculateStateTax(annualIncome: number, stateCodeOrSlug: string, deductions = 0) {
  const state = findState(stateCodeOrSlug);
  return Math.max(0, annualIncome - deductions) * state.rate;
}

export function calculateAnnualTax(income: number, profile: TaxProfileInput) {
  const deductions = profile.estimatedAnnualDeductions ?? standardDeductionFor(profile.filingStatus);
  const se = calculateSelfEmploymentTax(income);
  const federal = calculateFederalIncomeTax(income - se.deductibleHalf, profile.filingStatus, deductions);
  const state = calculateStateTax(income, profile.state, deductions);
  return { federal, state, selfEmployment: se.tax, total: federal + state + se.tax };
}

export function calculateSetAside(payment: number, profile: TaxProfileInput, ytdIncome = 0, expectedAnnualIncome?: number): SetAsideResult {
  const annualIncome = Math.max(payment + ytdIncome, expectedAnnualIncome || payment + ytdIncome);
  const annual = calculateAnnualTax(annualIncome, profile);
  const rate = annualIncome > 0 ? annual.total / annualIncome : 0;
  const federalRate = annualIncome > 0 ? annual.federal / annualIncome : 0;
  const stateRate = annualIncome > 0 ? annual.state / annualIncome : 0;
  const seRate = annualIncome > 0 ? annual.selfEmployment / annualIncome : 0;

  return {
    federal: payment * federalRate,
    state: payment * stateRate,
    selfEmployment: payment * seRate,
    total: payment * rate,
    percentage: rate * 100,
    annualTaxEstimate: annual.total,
  };
}

export function calculateSafeHarbor(profile: TaxProfileInput, currentAnnualTax: number) {
  const ninetyPercentCurrent = currentAnnualTax * 0.9;
  const prior = profile.priorYearTaxLiability && profile.priorYearTaxLiability > 0 ? profile.priorYearTaxLiability : null;
  if (!prior) {
    return { annualRequired: ninetyPercentCurrent, method: "90% current-year estimate" };
  }
  return prior <= ninetyPercentCurrent
    ? { annualRequired: prior, method: "100% prior-year safe harbor" }
    : { annualRequired: ninetyPercentCurrent, method: "90% current-year estimate" };
}

export function quarterForDate(date = new Date()) {
  const month = date.getMonth();
  if (month <= 2) return 1;
  if (month <= 4) return 2;
  if (month <= 7) return 3;
  return 4;
}

export const estimatedTaxDueDates = [
  { quarter: 1, period: "Jan. 1 - Mar. 31", due: "2026-04-15" },
  { quarter: 2, period: "Apr. 1 - May 31", due: "2026-06-15" },
  { quarter: 3, period: "Jun. 1 - Aug. 31", due: "2026-09-15" },
  { quarter: 4, period: "Sep. 1 - Dec. 31", due: "2027-01-15" },
];

export function nextDueDate(date = new Date()) {
  const now = date.getTime();
  return estimatedTaxDueDates.find((item) => new Date(`${item.due}T23:59:59Z`).getTime() >= now) ?? estimatedTaxDueDates[0];
}

export function daysUntilDue(date = new Date()) {
  const due = nextDueDate(date);
  const diff = new Date(`${due.due}T00:00:00Z`).getTime() - date.getTime();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export function quarterlyPlan(ytdIncome: number, profile: TaxProfileInput, mode: "standard" | "annualized") {
  const currentQuarter = quarterForDate();
  const annualizedIncome = mode === "annualized" ? (ytdIncome / currentQuarter) * 4 : ytdIncome;
  const tax = calculateAnnualTax(annualizedIncome, profile);
  const safeHarbor = calculateSafeHarbor(profile, tax.total);
  const required = safeHarbor.annualRequired;

  return estimatedTaxDueDates.map((due) => ({
    ...due,
    amount: due.quarter <= currentQuarter ? required / 4 : Math.max(0, (required - (required / 4) * currentQuarter) / (4 - currentQuarter || 1)),
    method: safeHarbor.method,
  }));
}

export function filingStatusLabel(status: FilingStatus) {
  return {
    single: "Single",
    married_joint: "Married filing jointly",
    married_separate: "Married filing separately",
    head: "Head of household",
  }[status];
}
