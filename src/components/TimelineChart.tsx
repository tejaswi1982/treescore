import type { Metric } from "@/data/treeScoreSchema";
import {
  isPublicMetric,
  historicalChange,
  displayPercent,
} from "@/lib/metrics";
export function TimelineChart({
  series,
  title,
  compact = false,
}: {
  series: Metric[];
  title?: string;
  compact?: boolean;
}) {
  const data = series
    .filter(isPublicMetric)
    .sort((a, b) => a.seasonYear - b.seasonYear);
  const change = historicalChange(data);
  return (
    <figure className="rounded-xl border border-line bg-cream p-5 md:p-7">
      <figcaption className="font-serif text-xl text-forest">
        {title ?? "Change since 2015"}
      </figcaption>
      <p className="mt-2 text-xs text-moss-deep">
        Satellite-derived green cover estimate · historical series
      </p>
      {data.length === 0 ? (
        <div className="py-8">
          <p className="font-serif text-2xl text-forest">
            Historical analysis pending
          </p>
          <p className="mt-3 text-sm leading-relaxed text-ink/70">
            No reviewed 2015 baseline is available. Equivalent November–February
            windows will be compared; no loss or gain is assumed.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 space-y-4">
            {data.map((m) => (
              <div key={m.seasonYear}>
                <div className="flex justify-between gap-3 text-sm">
                  <span>
                    {m.seasonYear}–{String(m.seasonYear + 1).slice(2)}
                  </span>
                  <span>{displayPercent(m.greenCoverPercent)}</span>
                </div>
                <div className="mt-2 h-2 rounded bg-sand">
                  <div
                    className="h-2 rounded bg-moss"
                    style={{ width: `${m.greenCoverPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-moss-deep">
            Bar scale: 0–100%. Missing years are not interpolated.
          </p>
          <p className="mt-6 text-sm">
            {change
              ? `${change.percentagePoints > 0 ? "+" : ""}${change.percentagePoints.toFixed(1)} percentage points since the 2015–16 season. Relative change: ${change.relativePercent === null ? "undefined (zero baseline)" : `${change.relativePercent.toFixed(1)}%`}.`
              : "Change unavailable: a reviewed, comparable baseline and later observation on the same land mask are required."}
          </p>
        </>
      )}
      {!compact && (
        <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-moss-deep">
          Historical estimates use a separate, consistent Sentinel-2 TOA series.
          They are not subtracted from current surface-reflectance estimates.
          Vegetation change cannot be converted to a count of trees.
        </p>
      )}
    </figure>
  );
}
