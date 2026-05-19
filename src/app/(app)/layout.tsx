import Link from "next/link";
import { requireUser } from "@/lib/auth-helpers";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/dashboard/quarterly">Quarterly</Link>
        <Link href="/dashboard/export">Export</Link>
        <Link href="/onboard">Tax profile</Link>
        <Link href="/pricing">Upgrade</Link>
      </aside>
      <main className="app-main">{children}</main>
    </div>
  );
}
