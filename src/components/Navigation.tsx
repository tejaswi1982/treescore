"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FEATURED_LOCALITY_ID } from "@/data/localities";

const links = [
  { href: "/rankings", label: "Rankings" },
  { href: "/compare", label: "Compare" },
  { href: "/history", label: "History" },
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className="sticky top-0 z-50 border-b border-line bg-paper/95 backdrop-blur"
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-8">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-serif text-2xl tracking-tight text-forest">
            TreeScore
          </span>
          <span className="kicker text-mist">Beta</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors hover:text-forest ${
                pathname.startsWith(link.href) ? "text-forest" : "text-ink/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/locality/${FEATURED_LOCALITY_ID}`}
            className="rounded-full bg-forest px-4 py-2 text-sm text-cream transition-opacity hover:opacity-90"
          >
            Andheri West Core
          </Link>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-px w-5 bg-ink transition-transform ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-5 bg-ink transition-transform ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-line bg-paper px-5 pb-6 pt-2 lg:hidden"
          id="mobile-navigation"
          aria-label="Primary mobile"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block border-b border-line/60 py-3 font-serif text-lg text-forest"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={`/locality/${FEATURED_LOCALITY_ID}`}
            className="mt-5 inline-block rounded-full bg-forest px-5 py-2.5 text-sm text-cream"
          >
            Explore Andheri West Core
          </Link>
        </nav>
      )}
    </header>
  );
}
