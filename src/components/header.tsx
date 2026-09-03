// src/components/header.tsx
"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, type NavItem } from "@/config/nav";

function isItemCurrent(item: NavItem, pathname: string) {
  return item.href === pathname || (item.children?.some((c) => c.href === pathname) ?? false);
}

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pathname = usePathname();
  const closeMenu = useCallback(() => setOpenMenu(null), []);

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-cream">
      <div className="container-cr flex flex-wrap items-center gap-6 py-[14px]">
        <Link href="/" className="flex flex-none items-center gap-3 text-ink no-underline">
          <Image
            src="/images/logo.jpeg"
            alt="Communication Resources"
            width={40}
            height={40}
            className="block h-10 w-10 object-contain mix-blend-multiply"
          />
          <span className="font-heading text-[15px] font-semibold leading-[1.15] tracking-[-0.01em]">
            Communication
            <br />
            Resources
          </span>
        </Link>

        <nav className="ml-auto hidden min-w-0 flex-wrap items-center gap-x-[18px] gap-y-[10px] text-[13.5px] font-medium nav:flex">
          {nav.map((item, i) => {
            const isCurrent = isItemCurrent(item, pathname);

            if (!item.children) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`no-underline hover:text-red ${isCurrent ? "text-red" : "text-ink"}`}
                >
                  {item.label}
                </Link>
              );
            }

            const isOpen = openMenu === item.label;
            const isLastTwo = i >= nav.length - 2;

            return (
              <div
                key={item.label}
                className="relative -my-[14px] py-[14px]"
                onMouseEnter={() => setOpenMenu(item.label)}
                onMouseLeave={closeMenu}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  onClick={() => setOpenMenu(isOpen ? null : item.label)}
                  onKeyDown={(e) => e.key === "Escape" && closeMenu()}
                  className={`flex items-center gap-[6px] border-0 bg-transparent p-0 font-body text-[13.5px] font-medium cursor-pointer hover:text-red ${
                    isCurrent ? "text-red" : "text-ink"
                  }`}
                >
                  {item.label}
                  <span className="flex-none text-[9px] text-muted-3">▼</span>
                </button>

                <div
                  role="menu"
                  className={`absolute top-full w-[268px] flex-col border border-line border-t-[3px] border-t-red bg-white py-2 shadow-[0_14px_34px_rgba(31,26,24,0.14)] ${
                    isLastTwo ? "right-[-18px] left-auto" : "left-[-18px] right-auto"
                  } ${isOpen ? "flex" : "hidden"}`}
                >
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      target={child.external ? "_blank" : undefined}
                      rel={child.external ? "noopener noreferrer" : undefined}
                      role="menuitem"
                      onKeyDown={(e) => e.key === "Escape" && closeMenu()}
                      className="block px-5 py-[9px] text-sm leading-[1.35] text-ink-soft no-underline hover:bg-cream-2 hover:text-red"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <button
          type="button"
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
          onClick={() => setDrawerOpen((v) => !v)}
          className="ml-auto flex h-10 w-10 flex-none flex-col items-center justify-center gap-[5px] border-0 bg-transparent nav:hidden"
        >
          <span
            className={`block h-[2px] w-6 bg-ink transition-transform ${drawerOpen ? "translate-y-[7px] rotate-45" : ""}`}
          />
          <span
            className={`block h-[2px] w-6 bg-ink transition-opacity ${drawerOpen ? "opacity-0" : ""}`}
          />
          <span
            className={`block h-[2px] w-6 bg-ink transition-transform ${drawerOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {drawerOpen && (
        <div className="border-t border-line bg-cream nav:hidden">
          <nav className="container-cr flex flex-col gap-1 py-4">
            {nav.map((item) =>
              item.children ? (
                <details key={item.label} className="group">
                  <summary
                    className={`flex cursor-pointer list-none items-center justify-between py-3 text-[15px] font-medium ${
                      isItemCurrent(item, pathname) ? "text-red" : "text-ink"
                    }`}
                  >
                    {item.label}
                    <span className="text-[9px] text-muted-3 group-open:rotate-180">▼</span>
                  </summary>
                  <div className="flex flex-col gap-1 pb-2 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        target={child.external ? "_blank" : undefined}
                        rel={child.external ? "noopener noreferrer" : undefined}
                        onClick={() => setDrawerOpen(false)}
                        className="py-2 text-sm text-ink-soft no-underline hover:text-red"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`block py-3 text-[15px] font-medium no-underline hover:text-red ${
                    isItemCurrent(item, pathname) ? "text-red" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
