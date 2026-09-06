import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    signIn({ user }) {
      const allowed = process.env.ALLOWED_EMAILS;
      if (!allowed) return false;
      const list = allowed.split(",").map((e) => e.trim().toLowerCase());
      return list.includes((user.email ?? "").toLowerCase());
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
});
