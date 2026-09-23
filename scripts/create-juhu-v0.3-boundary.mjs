import { readFileSync, writeFileSync } from "node:fs";
import { polygonAreaSqKm } from "../src/lib/geometry.ts";

const sourcePath = "data/boundaries/mumbai-localities-v0.2.geojson";
const outputPath = "data/boundaries/mumbai-localities-v0.3.geojson";
const source = JSON.parse(readFileSync(sourcePath, "utf8"));
const revised = structuredClone(source);
revised.name = "mumbai-localities-v0.3";

const juhu = revised.features.find(
  (feature) => feature.properties.localityId === "juhu",
);
if (!juhu) throw new Error("Juhu v0.2 boundary is missing");

juhu.properties.boundaryVersion = "juhu-v0.3";
juhu.properties.boundaryConfidence = "medium";
juhu.properties.methodNote =
  "Basemap-reviewed TreeScore analysis polygon corrected after the v0.2 real-data check exposed unintended aerodrome, lagoon and open-ground inclusion. Not an official administrative boundary.";
juhu.properties.sourceNote =
  "Preserves the v0.2 northern, main eastern and conservative coastal residential edges. The southern edge was retraced against satellite imagery around the north and west of the lagoon/aerodrome complex, retaining the coastal residential strip while excluding the lagoon, operational/open airport land, runway-side surfaces, excess beach/sea and adjacent Santacruz/Vile Parle fabric.";
juhu.geometry.coordinates = [
  [
    [72.8255, 19.117],
    [72.8305, 19.1175],
    [72.835, 19.1135],
    [72.836, 19.106],
    [72.8358, 19.1036],
    [72.8335, 19.1033],
    [72.831, 19.1034],
    [72.829, 19.1033],
    [72.8285, 19.101],
    [72.828, 19.097],
    [72.8252, 19.0965],
    [72.8245, 19.105],
    [72.8248, 19.112],
    [72.8255, 19.117],
  ],
];

for (const id of ["andheri-west-core", "powai-lake-urban-area"]) {
  const before = source.features.find((f) => f.properties.localityId === id);
  const after = revised.features.find((f) => f.properties.localityId === id);
  if (JSON.stringify(before) !== JSON.stringify(after))
    throw new Error(`${id} changed while creating the Juhu-only revision`);
}

writeFileSync(outputPath, JSON.stringify(revised, null, 2) + "\n");
const oldGeometry = source.features.find(
  (feature) => feature.properties.localityId === "juhu",
).geometry;
const oldArea = polygonAreaSqKm(oldGeometry);
const newArea = polygonAreaSqKm(juhu.geometry);
console.log(
  JSON.stringify(
    {
      outputPath,
      oldAreaSqKm: oldArea,
      newAreaSqKm: newArea,
      removedSqKm: oldArea - newArea,
      removedPercent: ((oldArea - newArea) / oldArea) * 100,
    },
    null,
    2,
  ),
);
