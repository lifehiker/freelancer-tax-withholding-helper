"use client";

import { useState, useTransition } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(formData: FormData) {
    setError("");
    startTransition(async () => {
      const email = String(formData.get("email") || "");
      const password = String(formData.get("password") || "");
      if (mode === "signup") {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name: String(formData.get("name") || "") }),
        });
        if (!response.ok) {
          const body = await response.json().catch(() => ({}));
          setError(body.error || "Signup failed.");
          return;
        }
      }
      const result = await signIn("credentials", { email, password, redirect: false });
      if (result?.error) {
        setError("Email or password did not match.");
        return;
      }
      router.push(mode === "signup" ? "/onboard" : "/dashboard");
      router.refresh();
    });
  }

  return (
    <form className="card form" action={submit}>
      {mode === "signup" && (
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" className="input" name="name" autoComplete="name" />
        </div>
      )}
      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" className="input" name="email" type="email" autoComplete="email" required />
      </div>
      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" className="input" name="password" type="password" minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} required />
      </div>
      {error && <p className="danger">{error}</p>}
      <button className="button" disabled={pending}>{pending ? "Working..." : mode === "signup" ? "Create account" : "Log in"}</button>
    </form>
  );
}
