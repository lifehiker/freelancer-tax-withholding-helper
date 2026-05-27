import type { Metadata, Viewport } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "WithholdingHelper | Freelance Tax Set-Aside Calculator",
    template: "%s | WithholdingHelper",
  },
  description: "Calculate how much to set aside from each freelance payment for federal, self-employment, and state estimated taxes.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#176b58",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <nav className="shell nav" aria-label="Primary">
            <Link className="brand" href="/">WithholdingHelper</Link>
            <div className="nav-links">
              <Link href="/calculator">Calculator</Link>
              <Link href="/quarterly-tax-dates">Tax dates</Link>
              <Link href="/pricing">Pricing</Link>
              <Link href="/guide/how-much-to-set-aside-freelance-taxes">Guides</Link>
              <Link href="/login">Log in</Link>
              <Link className="button" href="/signup">Start free</Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
