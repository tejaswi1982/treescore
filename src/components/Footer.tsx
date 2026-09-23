import Link from "next/link";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/rankings", label: "Ranking policy" },
  { href: "/compare", label: "Compare" },
  { href: "/history", label: "History" },
];

const aboutLinks = [
  { href: "/methodology", label: "Methodology" },
  { href: "/about", label: "About" },
];

export function Footer() {
  return (
    <footer className="bg-forest-deep text-cream">
      <div className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <p className="font-serif text-2xl tracking-tight">TreeScore</p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              Measure India&rsquo;s urban green cover clearly, honestly and
              consistently.
            </p>
            <p className="kicker mt-8 text-sun/80">
              Let&rsquo;s measure first.
            </p>
          </div>
          <nav aria-label="Explore">
            <p className="kicker mb-5 text-cream/40">Explore</p>
            <ul className="space-y-3 text-sm">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/75 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="About">
            <p className="kicker mb-5 text-cream/40">About</p>
            <ul className="space-y-3 text-sm">
              {aboutLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-cream/75 transition-colors hover:text-cream"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-cream/10 pt-6 text-xs text-cream/45 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 TreeScore. A measurement platform. Built first for Mumbai.
          </p>
          <p>
            Satellite-derived green cover estimate · TreeScore-defined analysis
            areas.
          </p>
        </div>
      </div>
    </footer>
  );
}
