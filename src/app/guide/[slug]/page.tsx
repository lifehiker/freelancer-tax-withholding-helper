import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicCalculator } from "@/components/PublicCalculator";
import { findGuide, guides } from "@/data/guides";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolved = await params;
  const guide = findGuide(resolved.slug);
  return {
    title: guide?.title || "Freelance Tax Guide",
    description: guide?.description,
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolved = await params;
  const guide = findGuide(resolved.slug);
  if (!guide) notFound();
  return (
    <main className="shell section">
      <article style={{ maxWidth: 840 }}>
        <div className="eyebrow">Guide</div>
        <h1>{guide.title}</h1>
        <p className="lead">{guide.description}</p>
        {guide.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      </article>
      <section className="section">
        <PublicCalculator compact />
      </section>
      <Link className="secondary-button" href="/blog">Browse all articles</Link>
    </main>
  );
}
