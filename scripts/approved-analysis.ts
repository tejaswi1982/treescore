import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import type { Metric } from "../src/data/treeScoreSchema.ts";

// Global defaults deliberately remain unapproved. Release approval is scoped.
export function approvedAnalysisConfig(
  m: Metric,
  config: Record<string, unknown>,
) {
  if (
    m.thresholdDecisionId === config.thresholdDecisionId &&
    typeof config.greenThreshold === "number"
  )
    return config;
  const approvals = ((config.approvalFiles ?? []) as string[]).map((path) =>
    JSON.parse(readFileSync(path, "utf8")),
  );
  const approval = approvals.find(
    (a) =>
      a.thresholdApproved === true &&
      a.approvalStatus === "human-approved" &&
      [
        "localityId",
        "kind",
        "seasonYear",
        "dateStart",
        "dateEnd",
        "collection",
        "boundaryVersion",
        "methodVersion",
        "thresholdDecisionId",
      ].every(
        (key) => a[key] === (m as unknown as Record<string, unknown>)[key],
      ),
  );
  if (!approval)
    throw new Error(
      "No human approval for this locality, season, collection and methodology",
    );
  const boundaryFiles = (config.boundaryFiles ?? {}) as Record<string, string>;
  const approvedBoundaryFile =
    boundaryFiles[String(approval.boundaryVersion)] ??
    String(config.boundaryFile);
  for (const [path, expected] of [
    [approvedBoundaryFile, approval.boundarySha256],
    [approval.referenceFile, approval.referenceSha256],
  ]) {
    if (
      createHash("sha256").update(readFileSync(path)).digest("hex") !== expected
    )
      throw new Error("Approved boundary or calibration sample set changed");
  }
  if (
    m.calibrationVersion !== approval.calibrationVersion ||
    m.referenceSha256 !== approval.referenceSha256 ||
    m.reviewStatus !== "human-approved" ||
    m.methodologyVersion !== m.methodVersion ||
    m.validLandAreaSqKm !== m.analysisAreaSqKm ||
    m.analysisStart !== m.dateStart ||
    m.analysisEnd !== approval.analysisEndInclusive ||
    m.sceneCount !== m.imageCount ||
    m.cloudMaskMethod !== approval.cloudMaskMethod ||
    !m.localityName?.trim()
  )
    throw new Error("Missing or inconsistent approved release provenance");
  return { ...config, ...approval, greenThreshold: approval.approvedThreshold };
}
