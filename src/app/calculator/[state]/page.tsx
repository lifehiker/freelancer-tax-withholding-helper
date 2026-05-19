import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicCalculator } from "@/components/PublicCalculator";
import { findState, states } from "@/data/states";

export function generateStaticParams() {
  return states.map((state) => ({ state: state.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const resolved = await params;
  const state = findState(resolved.state);
  return {
    title: `Freelance Tax Calculator for ${state.name}`,
    description: `Calculate federal, self-employment, and ${state.name} state tax set-aside from each freelance payment.`,
  };
}

export default async function StateCalculatorPage({ params }: { params: Promise<{ state: string }> }) {
  const resolved = await params;
  const state = states.find((item) => item.slug === resolved.state);
  if (!state) notFound();
  return (
    <main className="shell section">
      <div className="eyebrow">{state.name} calculator</div>
      <h1>Freelance tax calculator for {state.name}</h1>
      <p className="lead">{state.note} Use this page to estimate how much of each freelance payment to move into tax savings.</p>
      <PublicCalculator initialState={state.code} />
    </main>
  );
}
