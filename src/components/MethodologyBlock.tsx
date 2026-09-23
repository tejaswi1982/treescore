import Link from "next/link";

const blocks = [
  {
    title: "Green-cover estimate",
    copy: "Vegetation as a percentage of adequately observed analysis land.",
  },
  {
    title: "Satellite-derived",
    copy: "Sentinel-2 and NDVI. Publication follows calibration and review.",
  },
  {
    title: "Not tree count",
    copy: "We do not claim exact tree numbers in this MVP.",
  },
];

/** The three-card "what TreeScore measures" strip. */
export function MethodologyBlock() {
  return (
    <div>
      <div className="grid gap-4 md:grid-cols-3">
        {blocks.map((b) => (
          <div
            key={b.title}
            className="rounded-xl border border-line bg-cream p-6"
          >
            <h3 className="font-serif text-lg text-forest">{b.title}</h3>
            <p className="mt-2.5 text-sm leading-relaxed text-ink/70">
              {b.copy}
            </p>
          </div>
        ))}
      </div>
      <Link
        href="/methodology"
        className="mt-7 inline-block text-sm text-moss-deep underline underline-offset-4 transition-colors hover:text-forest"
      >
        Read full methodology →
      </Link>
    </div>
  );
}
