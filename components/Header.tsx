"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowCircleIcon, CartIcon, CloseIcon, MenuIcon, SearchIcon, UserIcon } from "./Icons";
import { useStore } from "./Store";

export const QUICK_LINKS = [
  { label: "Curtain Fabric", href: "/fabrics?usage=curtain-fabric" },
  { label: "Upholstery", href: "/fabrics?usage=upholstery-fabric" },
  { label: "Tablecloth & PVC", href: "/fabrics?usage=tablecloth" },
  { label: "Plain & Minimal", href: "/fabrics?pattern=minimalist-plain" },
  { label: "Florals", href: "/fabrics?pattern=nature-floral" },
  { label: "Kids", href: "/fabrics?pattern=specialty-kids" },
  { label: "Natural Classics", href: "/fabrics?type=natural-classics" },
];

export function Header() {
  const router = useRouter();
  const params = useSearchParams();
  const { count, setOpen } = useStore();
  const [menu, setMenu] = useState(false);
  const [q, setQ] = useState(params.get("q") ?? "");

  useEffect(() => setQ(params.get("q") ?? ""), [params]);
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  return (
    <header className="site-header">
      <div className="header-row">
        <button className="icon-btn menu-toggle" aria-label="Open menu" onClick={() => setMenu(true)}>
          <MenuIcon />
        </button>
        <Link href="/" className="logo" aria-label="Mad About Fabrics home">
          <small>Mad About</small>
          <span>Fabrics</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <nav className="desktop-nav" aria-label="Main">
            <Link href="/fabrics">Shop</Link>
            <Link href="/saved">My Fabrics</Link>
            <Link href="/contact">Contact</Link>
          </nav>
          <div className="header-icons">
            <Link href="/saved" className="icon-btn" aria-label="Saved fabrics">
              <UserIcon />
            </Link>
            <button className="icon-btn" aria-label={`Basket, ${count} items`} onClick={() => setOpen(true)}>
              <CartIcon />
              {count > 0 && <span className="badge">{count}</span>}
            </button>
          </div>
        </div>
      </div>
      <div className="search-row">
        <form
          className="search-pill"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const v = q.trim();
            router.push(v ? `/fabrics?q=${encodeURIComponent(v)}` : "/fabrics");
          }}
        >
          <SearchIcon />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search fabrics"
            aria-label="Search fabrics"
            enterKeyHint="search"
          />
          <button type="submit" aria-label="Search">
            <ArrowCircleIcon />
          </button>
        </form>
        <nav className="chips" aria-label="Quick links">
          {QUICK_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="chip">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      {menu && (
        <div className="menu-panel" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="icon-btn" aria-label="Close menu" onClick={() => setMenu(false)}>
            <CloseIcon />
          </button>
          {[{ label: "All Fabrics", href: "/fabrics" }, ...QUICK_LINKS, { label: "My Fabrics", href: "/saved" }, { label: "Contact", href: "/contact" }].map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setMenu(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
