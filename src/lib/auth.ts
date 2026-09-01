// src/lib/auth.ts
// Single NextAuth instance serving two very different audiences:
//
//   1. Admin dashboard — CredentialsProvider against AdminUser. Bypasses the
//      Prisma adapter entirely (this is documented NextAuth behaviour) and
//      always resolves to role "ADMIN".
//   2. Public site (buyers/suppliers/farmers/students) — EmailProvider
//      (passwordless magic-link) against the normal User table, via the
//      Prisma adapter. New accounts default to role VISITOR until they take
//      an action (submit a sourcing request, list a product, etc.) that
//      naturally implies a role — see README for the elevation flow.
//
// Session strategy is forced to "jwt" because CredentialsProvider is
// incompatible with database sessions even when an adapter is present for
// the other provider — this is the standard way to combine the two.

import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { sendMagicLinkEmail } from "@/lib/mail";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",       // public-site sign-in (magic link)
    verifyRequest: "/login/check-email",
  },
  providers: [
    CredentialsProvider({
      id: "admin-credentials",
      name: "AgroLink Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const admin = await db.adminUser.findUnique({ where: { email: credentials.email } });
        if (!admin) return null;

        const valid = await bcrypt.compare(credentials.password, admin.passwordHash);
        if (!valid) return null;

        return { id: admin.id, email: admin.email, name: admin.name, role: "ADMIN" };
      },
    }),

    EmailProvider({
      // `server` is required by next-auth v4's type signature but unused —
      // sendVerificationRequest below fully replaces the default SMTP send.
      server: { host: "", port: 0, auth: { user: "", pass: "" } },
      from: process.env.EMAIL_FROM || "AgroLink <hello@agrolink.africa>",
      maxAge: 15 * 60, // magic link valid for 15 minutes
      async sendVerificationRequest({
  identifier,
  url,
}: {
  identifier: string;
  url: string;
}) {
  await sendMagicLinkEmail(identifier, url);
},
    } as any),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // CredentialsProvider (admin) returns a plain object with `.role` set
        // directly. EmailProvider (via the adapter) returns the actual
        // Prisma User row, which also has a `.role` column — either way this
        // just works.
        token.role = (user as any).role;
        token.id = (user as any).id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};

export function isAdminSession(session: Session | null) {
  return session?.user?.role === "ADMIN";
}

export function isMemberSession(session: Session | null) {
  return !!session?.user && session.user.role !== "ADMIN";
}