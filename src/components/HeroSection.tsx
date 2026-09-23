import Link from "next/link";
import { CanopyArt } from "./CanopyArt";
import { TrustNote } from "./TrustNote";

export function HeroSection() {
  return (
    <section className="relative isolate flex items-center bg-forest-deep text-cream">
      <CanopyArt />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-12 md:px-8 md:py-16">
        <p className="kicker mb-7 text-cream/65">Mumbai · Analysis beta</p>
        <h1 className="max-w-3xl font-serif text-[2.75rem] leading-[1.05] tracking-tight md:text-7xl">
          How green is your neighbourhood?
        </h1>
        <p className="mt-7 max-w-lg text-base leading-relaxed text-cream/80 md:text-lg">
          A calm, data-first way to measure and compare urban green cover across
          Indian cities — starting with Mumbai.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="#explore"
            className="rounded-full bg-cream px-6 py-3 text-sm font-medium text-forest transition-opacity hover:opacity-90"
          >
            Explore analysis areas
          </Link>
          <Link
            href="/rankings"
            className="rounded-full border border-cream/40 px-6 py-3 text-sm text-cream transition-colors hover:border-cream/80"
          >
            Ranking policy
          </Link>
        </div>
        <TrustNote tone="light" className="mt-14" />
      </div>
    </section>
  );
}
