import Link from "next/link";
import type { LocalityRecord } from "@/data/treeScoreSchema";
import { displayPercent, MEASUREMENT_LABEL } from "@/lib/metrics";
export function LocalityCard({ locality: l }: { locality: LocalityRecord }) {
  return (
    <Link
      href={`/locality/${l.id}`}
      className="block rounded-xl border border-line bg-cream p-5 transition-colors hover:border-moss"
    >
      <h3 className="font-serif text-xl text-forest">{l.name}</h3>
      <p className="mt-4 font-serif text-2xl text-forest">
        {displayPercent(l.currentMetrics?.greenCoverPercent)}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-moss-deep">
        {MEASUREMENT_LABEL}
      </p>
      <p className="mt-4 border-t border-line pt-3 text-xs text-moss-deep">
        TreeScore-defined analysis area · View details →
      </p>
    </Link>
  );
}
