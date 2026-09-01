// src/components/layout/MobileNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Leaf, GraduationCap, MoreHorizontal } from "lucide-react";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/market", label: "Market", icon: ShoppingBag },
  { href: "/farm", label: "Farm", icon: Leaf },
  { href: "/academy", label: "Academy", icon: GraduationCap },
  { href: "/more", label: "More", icon: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-cream-50/95 backdrop-blur border-t border-forest-100">
      <div className="grid grid-cols-5 text-[11px] font-medium text-ink-soft">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-1 py-2.5 ${active ? "text-forest-700 font-semibold" : ""}`}
            >
              <Icon size={20} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
