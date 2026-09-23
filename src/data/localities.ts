import boundaries from "./boundaries.json";
import configuration from "../../data/localities.json";
import current from "../../data/metrics/current.json";
import historical from "../../data/historical/series.json";
import type { BoundaryFeature, LocalityRecord } from "./treeScoreSchema";
import { isPublicMetric, rankingGroups } from "../lib/metrics";

export const FEATURED_LOCALITY_ID = "andheri-west-core";
export const plannedLocalities = configuration.filter(
  (l) => l.dataStatus === "planned",
);
export const localities: LocalityRecord[] = configuration
  .filter((l) => !["planned", "boundary-review"].includes(l.dataStatus))
  .flatMap((config) => {
    const boundary = boundaries.features.find(
      (f) => f.properties.localityId === config.id,
    ) as BoundaryFeature | undefined;
    if (!boundary) return [];
    const valid = (values: unknown[]) =>
      values
        .filter(isPublicMetric)
        .filter(
          (m) =>
            m.localityId === config.id &&
            m.boundaryVersion === boundary.properties.boundaryVersion,
        );
    const currentMetrics =
      valid(current)
        .filter((m) => m.kind === "current")
        .sort((a, b) => b.seasonYear - a.seasonYear)[0] ?? null;
    return [
      {
        id: config.id,
        name: config.displayName,
        parentLocality: config.parentLocality,
        city: "Mumbai",
        boundary,
        currentMetrics,
        historicalMetrics: valid(historical).filter(
          (m) => m.kind === "historical",
        ),
        dataStatus: currentMetrics
          ? "verified"
          : config.dataStatus === "processing"
            ? "processing"
            : config.dataStatus === "unavailable"
              ? "unavailable"
              : "pending",
        publishableRanking: config.publishableRanking,
      },
    ];
  });
export const localitiesByRank = rankingGroups(localities).flat();
for (const group of rankingGroups(localities)) {
  if (group.length < 2) continue;
  for (const locality of group)
    locality.ranking = {
      rank:
        group.findIndex(
          (l) =>
            l.currentMetrics!.greenCoverPercent ===
            locality.currentMetrics!.greenCoverPercent,
        ) + 1,
      total: group.length,
    };
}
export function getLocality(id: string) {
  return localities.find((l) => l.id === id);
}
export function getFeaturedLocality() {
  return getLocality(FEATURED_LOCALITY_ID) ?? localities[0];
}
