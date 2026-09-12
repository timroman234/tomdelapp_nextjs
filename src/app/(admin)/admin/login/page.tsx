"use client";

import { Suspense } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function LoginCard() {
  const params = useSearchParams();
  const denied = params.get("error") === "AccessDenied";
  const callbackUrl = params.get("callbackUrl") ?? "/admin";

  return (
    <div className="w-full max-w-[380px] border border-line-2 bg-white p-9">
      <div className="mb-7 flex items-center gap-3">
        <Image
          src="/images/logo.jpeg"
          alt="Communication Resources"
          width={36}
          height={36}
          className="block h-9 w-9 object-contain mix-blend-multiply"
        />
        <span className="font-heading text-[14px] font-semibold leading-[1.15] tracking-[-0.01em]">
          Communication
          <br />
          Resources
        </span>
      </div>

      <h1 className="mb-2 font-heading text-[22px] font-semibold tracking-[-0.01em]">Greenroom</h1>
      <p className="mb-6 text-sm leading-[1.5] text-ink-soft">
        Sign in with an authorized Google account to edit site content.
      </p>

      {denied && (
        <p className="mb-5 border border-red-dark bg-[#FBEAEA] px-4 py-3 text-sm text-red-dark">
          That Google account isn&apos;t authorized for admin access.
        </p>
      )}

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl })}
        className="w-full rounded-[2px] bg-red px-6 py-[13px] text-[15px] font-semibold text-white hover:bg-red-dark"
      >
        Sign in with Google
      </button>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream-2 p-6">
      <Suspense>
        <LoginCard />
      </Suspense>
    </div>
  );
}
