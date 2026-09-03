// src/components/utility-bar.tsx
import Link from "next/link";

export function UtilityBar() {
  return (
    <div className="bg-ink text-[#F0E9E4] text-[13px] tracking-[0.04em]">
      <div className="container-cr flex items-center justify-between gap-6 py-[10px]">
        <span className="opacity-[0.85]">
          Straight Talk by Tom DeLapp · new episode every week
        </span>
        <Link
          href="/#subscribe"
          className="-my-[3px] flex-none whitespace-nowrap rounded-[2px] bg-red px-4 py-[7px] text-[13px] font-semibold tracking-[0.02em] text-white no-underline hover:bg-red-bright"
        >
          Subscribe
        </Link>
      </div>
    </div>
  );
}
