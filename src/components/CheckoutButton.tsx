"use client";

import { useState, useTransition } from "react";

export function CheckoutButton({ plan }: { plan: "monthly" | "annual" }) {
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function checkout() {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (response.status === 401 || response.redirected) {
        window.location.href = "/login";
        return;
      }
      const body = await response.json().catch(() => ({}));
      if (body.url) {
        window.location.href = body.url;
        return;
      }
      setMessage(body.message || "Checkout is not configured in this environment.");
    });
  }

  return (
    <div>
      <button className="button" onClick={checkout} disabled={pending}>{pending ? "Opening..." : plan === "annual" ? "Choose annual" : "Choose monthly"}</button>
      {message && <p className="muted">{message}</p>}
    </div>
  );
}
