import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function LoginPage() {
  const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  return (
    <main className="shell section" style={{ maxWidth: 560 }}>
      <div className="eyebrow">Welcome back</div>
      <h1>Log in</h1>
      <AuthForm mode="login" googleEnabled={googleEnabled} />
      <p className="muted">Need an account? <Link href="/signup">Start free</Link>.</p>
    </main>
  );
}
