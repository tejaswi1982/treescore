import assert from "node:assert/strict";
const base = process.argv[2] ?? "http://127.0.0.1:3000";
const routes = [
  ["/", "How green is your neighbourhood?"],
  ["/compare", "Two areas, side by side."],
  ["/rankings", "Rankings are not published yet."],
  ["/history", "Green cover change since 2015"],
  ["/methodology", "Where the number comes from."],
  ["/about", "A calm mirror for the city."],
  ["/locality/andheri-west-core", "Andheri West Core"],
  ["/locality/powai-lake-urban-area", "Powai Lake + Urban Area"],
  ["/locality/juhu", "Juhu"],
];
const localLinks = new Set([
  "/manifest.webmanifest",
  "/sw.js",
  "/offline.html",
  "/robots.txt",
  "/sitemap.xml",
]);
for (const [route, heading] of routes) {
  const response = await fetch(new URL(route, base));
  assert.equal(response.status, 200, route);
  const html = await response.text();
  const title = html
    .match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&");
  assert.equal(title, heading, route + " heading");
  assert.ok(
    !/Demo data|canopyPercent|totalLocalities|trendSince2016/.test(html),
    route + " exposed legacy demo fields",
  );
  for (const match of html.matchAll(/href="(\/[^"#?]*)"/g))
    if (!match[1].startsWith("/_next/")) localLinks.add(match[1]);
  console.log(`PASS ${route}`);
}
const manifest = await (
  await fetch(new URL("/manifest.webmanifest", base))
).json();
for (const icon of manifest.icons) localLinks.add(icon.src);
for (const path of localLinks) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `Broken internal link/asset: ${path}`);
}
for (const path of [
  "/locality/not-a-locality",
  "/locality/bandra-west",
  "/not-a-page",
])
  assert.equal((await fetch(new URL(path, base))).status, 404, path);
console.log(
  `PASS ${localLinks.size} internal links/assets; unknown/planned routes return 404.`,
);
