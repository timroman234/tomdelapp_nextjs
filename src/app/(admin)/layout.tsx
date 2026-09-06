import type { Metadata } from "next";
import { bitter, plexSans } from "../fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Site Admin | Communication Resources",
  description: "Content admin for the Communication Resources website.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bitter.variable} ${plexSans.variable}`}>
      <body className="bg-cream-2 font-body text-ink antialiased">{children}</body>
    </html>
  );
}
