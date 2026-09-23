import Link from "next/link";
import type { LocalityRecord } from "@/data/treeScoreSchema";
import {
  displayPercent,
  MEASUREMENT_LABEL,
  BOUNDARY_DISCLAIMER,
} from "@/lib/metrics";
import { polygonAreaSqKm } from "@/lib/geometry";
import { displayAnalysisPeriod } from "@/lib/formatters";
export function ScoreCard({
  locality: l,
  className = "",
}: {
  locality: LocalityRecord;
  className?: string;
}) {
  const m = l.currentMetrics;
  return (
    <article
      className={`rounded-2xl border border-line bg-cream p-6 md:p-9 ${className}`}
    >
      <p className="kicker mb-3 text-moss">Mumbai · Beta analysis area</p>
      <h3 className="font-serif text-2xl tracking-tight text-forest">
        {l.name}
      </h3>
      <p className="mt-6 text-sm text-moss-deep">{MEASUREMENT_LABEL}</p>
      <p
        className={`mt-3 font-serif text-forest ${m ? "score-numeral text-7xl" : "text-3xl"}`}
      >
        {m
          ? displayPercent(m.greenCoverPercent)
          : l.dataStatus === "processing"
            ? "Analysis processing"
            : l.dataStatus === "unavailable"
              ? "Analysis unavailable"
              : "Analysis pending"}
      </p>
      {m && (
        <p className="mt-3 text-xs text-moss-deep">Reviewed beta measurement</p>
      )}
      {!m && (
        <p className="mt-4 text-sm leading-relaxed text-ink/70">
          The boundary is available. A calibrated, reviewed satellite estimate
          has not yet been published.
        </p>
      )}
      <dl className="mt-7 grid gap-4 border-t border-line pt-5 sm:grid-cols-2 text-sm">
        {l.ranking && (
          <div>
            <dt className="kicker text-moss">Comparable-area rank</dt>
            <dd className="mt-2">
              #{l.ranking.rank} of {l.ranking.total}
            </dd>
          </div>
        )}
        <div>
          <dt className="kicker text-moss">
            {m ? "Observed analysis land" : "Polygon footprint"}
          </dt>
          <dd className="mt-2">
            {(
              m?.analysisAreaSqKm ?? polygonAreaSqKm(l.boundary.geometry)
            ).toFixed(2)}{" "}
            km²{!m && " · approximate"}
          </dd>
        </div>
        <div>
          <dt className="kicker text-moss">Analysis period</dt>
          <dd className="mt-2">
            {m
              ? displayAnalysisPeriod(m.dateStart, m.dateEnd)
              : "Not yet published"}
          </dd>
        </div>
      </dl>
      {m && (
        <details className="mt-5 text-sm">
          <summary className="cursor-pointer">
            Source and analysis details
          </summary>
          <dl className="mt-3 space-y-2 break-words">
            <div>
              <dt>Source</dt>
              <dd>{m.collection}</dd>
            </div>
            <div>
              <dt>Method / boundary</dt>
              <dd>
                {m.methodVersion} / {m.boundaryVersion}
              </dd>
            </div>
            <div>
              <dt>NDVI threshold</dt>
              <dd>
                {m.threshold} · {m.thresholdDecisionId}
              </dd>
            </div>
            <div>
              <dt>Coverage / candidate scenes</dt>
              <dd>
                {m.coveragePercent.toFixed(1)}% / {m.imageCount}
              </dd>
            </div>
            <div>
              <dt>Reviewed</dt>
              <dd>{m.review?.reviewedAt}</dd>
            </div>
          </dl>
        </details>
      )}
      <p className="mt-5 text-xs leading-relaxed text-moss-deep">
        {BOUNDARY_DISCLAIMER}
      </p>
      <Link
        href="/methodology"
        className="mt-3 inline-block text-sm underline underline-offset-4"
      >
        Where the estimate comes from
      </Link>
    </article>
  );
}
