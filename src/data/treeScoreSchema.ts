export type Position = number[];
export interface BoundaryFeature {
  type: "Feature";
  properties: {
    localityId: string;
    name: string;
    parentLocality: string;
    boundaryVersion: string;
    boundaryConfidence: "medium" | "high" | "low";
    isOfficialBoundary: false;
    measurementLabel: string;
    publicDisclaimer: string;
  };
  geometry: { type: "Polygon"; coordinates: Position[][] };
}
export interface Metric {
  localityName?: string;
  validLandAreaSqKm?: number;
  analysisStart?: string;
  analysisEnd?: string;
  cloudMaskMethod?: string;
  sceneCount?: number;
  methodologyVersion?: string;
  calibrationVersion?: string;
  referenceSha256?: string;
  reviewStatus?: string;
  qualityStatus?: string;
  localityId: string;
  kind: "current" | "historical";
  seasonYear: number;
  greenCoverPercent: number;
  analysisAreaSqKm: number;
  greenAreaSqKm: number;
  polygonAreaSqKm: number;
  coveragePercent: number;
  imageCount: number;
  threshold: number;
  thresholdDecisionId: string;
  dateStart: string;
  dateEnd: string;
  collection: string;
  metric: string;
  methodVersion: string;
  boundaryVersion: string;
  waterMaskVersion: string;
  denominatorId: string;
  cloudScoreMinimum: number;
  sceneCloudMaximum: number;
  minimumObservations: number;
  minimumCoveragePercent: number;
  waterNdwiThreshold: number;
  crs: string;
  scaleMeters: number;
  runId: string;
  dataStatus: "calculated" | "verified" | "fixture";
  publishableRanking: boolean;
  review?: {
    reviewer: string;
    reviewedAt: string;
    notes: string;
    inputSha256: string;
  };
}
export interface LocalityRecord {
  id: string;
  name: string;
  parentLocality: string;
  city: string;
  boundary: BoundaryFeature;
  dataStatus: "pending" | "verified" | "processing" | "unavailable";
  publishableRanking: boolean;
  currentMetrics: Metric | null;
  historicalMetrics: Metric[];
  ranking?: { rank: number; total: number };
}
