"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="flex-none border-0 bg-transparent p-0 text-sm font-medium text-ink-soft hover:text-red"
    >
      Sign out
    </button>
  );
}
