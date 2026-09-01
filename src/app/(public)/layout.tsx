// src/app/(public)/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const user = session?.user && session.user.role !== "ADMIN"
    ? { name: session.user.name ?? null, email: session.user.email ?? null }
    : null;

  return (
    <div className="pb-20 lg:pb-0">
      <Header user={user} />
      <main>{children}</main>
      <Footer />
      <MobileNav />
      <WhatsAppFab />
    </div>
  );
}
