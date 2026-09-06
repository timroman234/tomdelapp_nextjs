import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/admin/sign-out-button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-cream-2">
      <header className="border-b border-line bg-cream">
        <div className="flex items-center gap-3 px-6 py-[14px]">
          <Image
            src="/images/logo.jpeg"
            alt="Communication Resources"
            width={32}
            height={32}
            className="block h-8 w-8 object-contain mix-blend-multiply"
          />
          <span className="font-heading text-[14px] font-semibold tracking-[-0.01em]">Site Admin</span>
          <span className="ml-auto text-sm text-muted">{session.user?.email}</span>
          <SignOutButton />
        </div>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
