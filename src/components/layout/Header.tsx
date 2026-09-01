// src/components/layout/Header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, User } from "lucide-react";
import { SearchOverlay } from "@/components/layout/SearchOverlay";

type HeaderUser = { name: string | null; email: string | null } | null;

export function Header({ user }: { user?: HeaderUser }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cream-50/90 backdrop-blur border-b border-forest-100">
      <div className="max-w-6xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image src="/logo-mark.png" alt="AgroLink" width={32} height={32} className="w-8 h-8" priority />
          <span className="font-display font-semibold text-lg tracking-tight text-forest-800">AgroLink</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7 font-medium text-sm text-ink-soft">
          <Link href="/" className="hover:text-forest-700">Home</Link>
          <Link href="/market" className="hover:text-forest-700">Market</Link>
          <Link href="/farm" className="hover:text-forest-700">Farm</Link>
          <Link href="/academy" className="hover:text-forest-700">Academy</Link>
          <Link href="/how-it-works" className="hover:text-forest-700">How It Works</Link>
          <Link href="/contact" className="hover:text-forest-700">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="w-10 h-10 rounded-full hover:bg-forest-100 flex items-center justify-center text-forest-800"
          >
            {searchOpen ? <X size={18} /> : <Search size={18} />}
          </button>

          <Link
            href={user ? "/account" : "/login"}
            className="hidden sm:flex w-10 h-10 rounded-full hover:bg-forest-100 items-center justify-center text-forest-800"
            aria-label={user ? "My account" : "Sign in"}
            title={user ? (user.name || user.email || "My account") : "Sign in"}
          >
            <User size={18} />
          </Link>

          <Link
            href="/sourcing"
            className="hidden sm:inline-flex items-center px-4 h-10 rounded-full bg-gold-600 text-cream-50 text-sm font-semibold hover:bg-gold-700 transition"
          >
            Start Sourcing
          </Link>
        </div>
      </div>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </header>
  );
}
