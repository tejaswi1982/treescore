import Link from "next/link";
import type { LocalityRecord } from "@/data/treeScoreSchema";
import { rankingGroups, displayPercent } from "@/lib/metrics";
export function RankingTable({ localities }: { localities: LocalityRecord[] }) {
  const groups = rankingGroups(localities);
  const measured = localities.filter((l) => l.currentMetrics).length;
  return (
    <div>
      <p className="mb-5 text-sm text-moss-deep">
        {measured === 2 && groups.length === 0
          ? "2 measured areas. Rankings will be introduced once cross-locality calibration is validated."
          : measured === 1
            ? "1 measured area. Rankings will appear as more comparable areas are published."
            : `${measured} measured areas · ${groups.reduce((n, g) => n + g.length, 0)} eligible for ranking`}
      </p>
      {groups.length === 0 ? (
        <div className="rounded-2xl border border-line bg-cream p-7">
          <h3 className="font-serif text-2xl text-forest">
            Rankings aren&apos;t published yet.
          </h3>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/70">
            Both reviewed measurements remain available on their locality and
            comparison pages. TreeScore will publish rankings after
            cross-locality calibration is validated.
          </p>
        </div>
      ) : (
        groups.map((group, index) => (
          <section
            key={index}
            className="mb-6 rounded-xl border border-line bg-cream p-5"
          >
            <p className="mb-4 text-sm">
              {group[0].currentMetrics!.dateStart} to{" "}
              {group[0].currentMetrics!.dateEnd} ·{" "}
              {group[0].currentMetrics!.methodVersion}
              {groups.length > 1 ? ` · Comparison group ${index + 1}` : ""}
            </p>
            {group.length < 2 ? (
              <p>
                One eligible area in this group; a ranking requires at least
                two.
              </p>
            ) : (
              <ol>
                {group.map((l) => {
                  const rank =
                    group.findIndex(
                      (peer) =>
                        peer.currentMetrics!.greenCoverPercent ===
                        l.currentMetrics!.greenCoverPercent,
                    ) + 1;
                  return (
                    <li key={l.id} className="border-t border-line py-4">
                      <Link
                        className="flex items-center justify-between gap-3"
                        href={`/locality/${l.id}`}
                      >
                        <span className="text-sm text-moss">#{rank}</span>
                        <span className="flex-1 font-serif text-lg text-forest">
                          {l.name}
                        </span>
                        <span>
                          {displayPercent(l.currentMetrics!.greenCoverPercent)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            )}
          </section>
        ))
      )}
      <p className="mt-5 text-xs leading-relaxed text-moss-deep">
        Satellite-derived green cover estimate. Andheri West Core and Juhu use
        the same Level-1 processing family but independently reviewed locality
        thresholds. TreeScore-defined analysis areas, not official
        administrative boundaries.
      </p>
      <Link href="/methodology" className="mt-3 inline-block text-sm underline">
        Ranking methodology
      </Link>
    </div>
  );
}
