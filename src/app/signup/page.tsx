import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";

export default function SignupPage() {
  return (
    <main className="shell section" style={{ maxWidth: 560 }}>
      <div className="eyebrow">Start free</div>
      <h1>Create your account</h1>
      <p className="lead">Free accounts can log five payments and see federal plus state set-aside estimates.</p>
      <AuthForm mode="signup" />
      <p className="muted">Already have an account? <Link href="/login">Log in</Link>.</p>
    </main>
  );
}
