import type { Position, BoundaryFeature } from "../data/treeScoreSchema.ts";

function onSegment(p: Position, a: Position, b: Position) {
  const cross = (p[1] - a[1]) * (b[0] - a[0]) - (p[0] - a[0]) * (b[1] - a[1]);
  return (
    Math.abs(cross) < 1e-12 &&
    p[0] >= Math.min(a[0], b[0]) &&
    p[0] <= Math.max(a[0], b[0]) &&
    p[1] >= Math.min(a[1], b[1]) &&
    p[1] <= Math.max(a[1], b[1])
  );
}
export function pointInRing(point: Position, ring: Position[]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i],
      b = ring[j];
    if (onSegment(point, a, b)) return true;
    if (
      a[1] > point[1] !== b[1] > point[1] &&
      point[0] < ((b[0] - a[0]) * (point[1] - a[1])) / (b[1] - a[1]) + a[0]
    )
      inside = !inside;
  }
  return inside;
}
export function pointInPolygon(
  point: Position,
  geometry: BoundaryFeature["geometry"],
) {
  return (
    point.length === 2 &&
    point.every(Number.isFinite) &&
    pointInRing(point, geometry.coordinates[0]) &&
    !geometry.coordinates.slice(1).some((r) => pointInRing(point, r))
  );
}
export function polygonAreaSqKm(geometry: BoundaryFeature["geometry"]) {
  const radians = Math.PI / 180;
  const area = (ring: Position[]) =>
    Math.abs(
      (ring
        .slice(1)
        .reduce(
          (sum, p, i) =>
            sum +
            (p[0] - ring[i][0]) *
              radians *
              (2 + Math.sin(ring[i][1] * radians) + Math.sin(p[1] * radians)),
          0,
        ) *
        6371008.8 ** 2) /
        2 /
        1e6,
    );
  return (
    area(geometry.coordinates[0]) -
    geometry.coordinates.slice(1).reduce((s, r) => s + area(r), 0)
  );
}
