// src/components/footer.tsx
import Image from "next/image";
import Link from "next/link";
import {
  footerColumns,
  footerTagline,
  footerCopyright,
  footerSignOff,
} from "@/config/footer-links";

export function Footer() {
  return (
    <footer className="bg-ink text-[rgba(251,248,245,0.72)]">
      <div className="container-cr grid grid-cols-1 gap-10 py-14 pb-[30px] nav:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))]">
        <div>
          <span className="mb-[14px] inline-flex items-center justify-center bg-cream p-2">
            <Image
              src="/images/logo.jpeg"
              alt="Communication Resources"
              width={40}
              height={40}
              className="block h-10 w-10 object-contain mix-blend-multiply"
            />
          </span>
          <div className="font-heading text-base font-semibold leading-[1.3] text-cream">
            Communication Resources
          </div>
          <p className="mt-[10px] max-w-[34ch] text-sm leading-[1.6]">{footerTagline}</p>
        </div>
        {footerColumns.map((column) => (
          <div key={column.label}>
            <div className="mb-[14px] text-xs uppercase tracking-[0.14em] text-[rgba(251,248,245,0.45)]">
              {column.label}
            </div>
            <div className="grid gap-[9px] text-sm">
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className="text-[rgba(251,248,245,0.82)] no-underline hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="container-cr flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-[rgba(251,248,245,0.12)] py-5 pb-10 text-[13px]">
        <span>{footerCopyright}</span>
        <span className="font-heading italic text-[rgba(251,248,245,0.6)]">{footerSignOff}</span>
      </div>
    </footer>
  );
}
