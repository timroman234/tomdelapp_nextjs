// src/components/sidebar-rail.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OffsetPhoto } from "@/components/offset-photo";
import { nav } from "@/config/nav";

const siblingLabels: Record<string, string> = {
  "About us": "More about us",
  "Straight Talk by Tom DeLapp": "More from the podcast",
  "Professional Services": "More services",
  "Communication Resources": "More resources",
};

type SidebarRailProps = {
  headshotSrc: string;
  headshotAlt: string;
  name: string;
  role: string;
};

export function SidebarRail({ headshotSrc, headshotAlt, name, role }: SidebarRailProps) {
  const pathname = usePathname();
  const section = nav.find((item) => item.children?.some((c) => c.href === pathname));
  const siblingLabel = section ? (siblingLabels[section.label] ?? `More ${section.label}`) : "";
  const siblingLinks = section?.children?.filter((c) => c.href !== pathname) ?? [];

  return (
    <div className="nav:sticky nav:top-[92px]">
      <OffsetPhoto
        src={headshotSrc}
        alt={headshotAlt}
        aspectRatio="4 / 5"
        offset={14}
        objectPosition="50% 35%"
        sizes="(min-width: 900px) 26vw, 90vw"
      />
      <div className="mt-[26px] border-l-2 border-red pl-4">
        <div className="font-heading text-[18px] font-semibold">{name}</div>
        <div className="mt-[3px] text-sm text-muted">{role}</div>
      </div>
      {siblingLinks.length > 0 && (
        <div className="mt-[26px] hidden gap-[9px] border-t border-line pt-[22px] text-sm nav:grid">
          <div className="mb-[3px] text-xs uppercase tracking-[0.14em] text-muted-3">
            {siblingLabel}
          </div>
          {siblingLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="text-ink-soft no-underline hover:text-red"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
