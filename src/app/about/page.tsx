import type { Metadata } from "next";
import Link from "next/link";
import { FEATURED_LOCALITY_ID } from "@/data/localities";

export const metadata: Metadata = {
  title: "About TreeScore",
  description:
    "TreeScore exists to measure India's urban green cover clearly, honestly and consistently. We measure. We compare. We remember.",
};

const notList = [
  "Not an activism platform.",
  "Not an NGO.",
  "Not a donation campaign.",
  "Not a tree-planting app.",
  "Not a political product.",
  "Not a government portal.",
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-sand/40">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
          <p className="kicker mb-5 text-moss">About</p>
          <h1 className="max-w-3xl font-serif text-4xl leading-tight tracking-tight text-forest md:text-6xl">
            A calm mirror for the city.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <div className="max-w-2xl space-y-7 text-lg leading-relaxed text-ink/80">
          <p className="font-serif text-2xl leading-snug text-forest md:text-3xl">
            TreeScore exists to measure India&rsquo;s urban green cover clearly,
            honestly and consistently.
          </p>
          <p className="text-moss-deep">We do not begin with conclusions.</p>
          <p className="text-moss-deep">We begin with data.</p>
          <p className="font-serif text-xl text-forest">
            We measure. We compare. We remember.
          </p>
          <p>Because cities deserve memory. And citizens deserve visibility.</p>
          <p>Good decisions begin with better measurement.</p>
        </div>
      </section>

      <section className="border-y border-line bg-sand/40">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20">
          <p className="kicker mb-8 text-moss">What TreeScore is not</p>
          <ul className="grid max-w-2xl gap-x-12 gap-y-3 text-[15px] text-ink/70 sm:grid-cols-2">
            {notList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-10 max-w-xl font-serif text-xl leading-relaxed text-forest md:text-2xl">
            It is a calm, trusted, data-first measurement platform for urban
            green cover.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-24">
        <p className="kicker mb-5 text-moss">Where we begin</p>
        <p className="max-w-2xl text-[15px] leading-relaxed text-ink/75">
          TreeScore begins with three Mumbai analysis areas: Andheri West Core,
          Powai Lake + Urban Area and Juhu. Boundaries are TreeScore-defined,
          not official administrative boundaries. Measurements are published
          only after calibration and review.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={`/locality/${FEATURED_LOCALITY_ID}`}
            className="rounded-full bg-forest px-6 py-3 text-sm text-cream transition-opacity hover:opacity-90"
          >
            Explore Andheri West Core
          </Link>
          <Link
            href="/methodology"
            className="rounded-full border border-line bg-cream px-6 py-3 text-sm text-ink/80 transition-colors hover:border-moss-soft"
          >
            Read the methodology
          </Link>
        </div>
      </section>
    </>
  );
}
