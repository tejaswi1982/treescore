import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const config = JSON.parse(readFileSync("data/analysis-config.json", "utf8"));
const source = readFileSync(config.boundaryFile, "utf8");
JSON.parse(source);
writeFileSync("src/data/boundaries.json", source);
mkdirSync("public/docs", { recursive: true });
writeFileSync(
  "public/docs/methodology.md",
  readFileSync("docs/methodology.md", "utf8"),
);
console.log("Synced unchanged canonical GeoJSON for the application.");
