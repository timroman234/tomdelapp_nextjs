import type { Metadata } from "next";
import { bitter, plexSans } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Communication Resources | Straight Talk by Tom DeLapp",
  description:
    "Communication counsel for school districts and the leaders who run them. Home of the Straight Talk podcast, hosted by Tom DeLapp.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bitter.variable} ${plexSans.variable}`}>
      <body className="bg-cream font-body text-ink antialiased">{children}</body>
    </html>
  );
}
