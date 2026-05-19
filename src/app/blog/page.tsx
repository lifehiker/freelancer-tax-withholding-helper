import Link from "next/link";
import { guides } from "@/data/guides";

export default function BlogPage() {
  return (
    <main className="shell section">
      <div className="eyebrow">Blog</div>
      <h1>Freelancer tax notes</h1>
      <div className="grid">
        {guides.map((guide) => (
          <Link className="card" href={`/guide/${guide.slug}`} key={guide.slug}>
            <h3>{guide.title}</h3>
            <p className="muted">{guide.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
