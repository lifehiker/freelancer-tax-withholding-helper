"use client";

import { useState, useTransition } from "react";

export function WaitlistForm({ source }: { source: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    setMessage("");
    startTransition(async () => {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      setMessage(response.ok ? "Reminder signup saved." : "Enter a valid email.");
      if (response.ok) setEmail("");
    });
  }

  return (
    <div className="card form">
      <h3>Get quarterly reminder emails</h3>
      <div className="field">
        <label htmlFor="waitlist-email">Email</label>
        <input id="waitlist-email" className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
      </div>
      <button className="button" onClick={submit} disabled={pending}>{pending ? "Saving..." : "Remind me"}</button>
      {message && <p className="muted">{message}</p>}
    </div>
  );
}
