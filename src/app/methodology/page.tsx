import { TrustNote } from "@/components/TrustNote";
export const metadata = {
  title: "How TreeScore measures green cover",
  description:
    "Satellite-derived green cover estimates, transparent boundaries and comparable seasonal analysis.",
};
const sections = [
  [
    "What the estimate means",
    "TreeScore analyses Sentinel-2 Surface Reflectance imagery (COPERNICUS/S2_SR_HARMONIZED). NDVI compares near-infrared and red light: (B8 − B4) / (B8 + B4). It responds to trees, shrubs, grass, lawns and mangroves. Green cover is a vegetation proxy; it is not exact tree canopy or an exact tree count. This is not an official government measurement.",
  ],
  [
    "Calibration before publication",
    "Andheri West Core uses the human-approved NDVI threshold 0.35; Juhu uses 0.30. Both apply only to their November 2025–February 2026 boundary, Sentinel-2 method, masks and reviewed reference polygons. The samples are visual references rather than field-verified ground truth. Locality thresholds are not universal TreeScore cutoffs.",
  ],
  [
    "Clouds, water and the denominator",
    "The current workflow filters scenes with cloudiness above 60%, retains pixels with Cloud Score+ cs_cdf at least 0.60 and valid spectral bands, then forms a median composite from November 1, 2025 through February 28, 2026. At least three clear observations are required. Pixels with composite NDWI greater than zero are excluded as water. Green area is divided by valid observed land area on a 10 m grid. Cloud and water masks can make mistakes.",
  ],
  [
    "Sensitivity of the reviewed beta measurement",
    "Andheri thresholds 0.30, 0.35 and 0.40 yield about 47.5%, 40.2% and 33.5%. Juhu thresholds 0.25, 0.30 and 0.35 yield about 58.3%, 48.8% and 39.6%. This sensitivity reflects mixed urban pixels and threshold choice; it is not a confidence interval. Small purposive samples, basemap timing, shadows and limited independent validation constrain accuracy claims. Processing version: level1-1.0.",
  ],
  [
    "Our analysis areas",
    "Each boundary is a TreeScore-defined analysis area, not an official administrative boundary. Andheri uses v0.2. Juhu uses the medium-confidence v0.3 boundary traced after visual QA removed unintended aerodrome and lagoon land before publication. Boundary and calibration are reviewed before a measurement is published. Polygon footprint is not the same as the observed-land denominator.",
  ],
  [
    "Change since 2015",
    "The baseline is November 2015–February 2016, not the entire 2015 calendar year. Current estimates use Sentinel-2 surface reflectance. Because that archive begins in 2017, the historical workflow uses a separate TOA collection consistently across all years. It compares identical seasonal windows and the same land pixels, excluding water detected in any selected year. Insufficient early imagery leaves the baseline unavailable. Differences are percentage points; relative change is undefined for a zero baseline.",
  ],
  [
    "What qualifies for ranking",
    "Rankings are withheld in the two-locality beta. Andheri and Juhu share the Level-1 processing family and season, but their independently reviewed thresholds differ. TreeScore will introduce rankings only after cross-locality calibration validates direct numerical ordering. Pending and unpublished analyses remain excluded.",
  ],
  [
    "Privacy and limitations",
    "Use my location checks your position inside the polygons in your browser. TreeScore does not store it. The basemap loads tiles from OpenStreetMap, which receives ordinary tile requests and your IP address. Ten-metre imagery mixes vegetation and built surfaces; seasonal effects, shadows, sparse observations and boundary uncertainty limit what an estimate proves.",
  ],
];
export default function MethodologyPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <p className="kicker text-moss">Measure first. Claim later.</p>
      <h1 className="mt-5 max-w-3xl font-serif text-4xl text-forest md:text-6xl">
        Where the number comes from.
      </h1>
      <p className="mt-6 text-lg text-moss-deep">
        Satellite-derived green cover estimate
      </p>
      <div className="mt-10">
        {sections.map(([title, copy], i) => (
          <section
            key={title}
            className="grid gap-4 border-t border-line py-9 md:grid-cols-[15rem_1fr]"
          >
            <h2 className="font-serif text-2xl text-forest">
              {String(i + 1).padStart(2, "0")} · {title}
            </h2>
            <p className="max-w-2xl text-[15px] leading-relaxed text-ink/80">
              {copy}
            </p>
          </section>
        ))}
      </div>
      <p className="text-sm">
        <a
          className="underline"
          href="https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_SR_HARMONIZED"
        >
          Sentinel-2 surface-reflectance catalog
        </a>{" "}
        ·{" "}
        <a
          className="underline"
          href="https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S2_HARMONIZED"
        >
          Historical TOA catalog
        </a>{" "}
        ·{" "}
        <a className="underline" href="/docs/methodology.md">
          Technical methodology
        </a>
      </p>
      <TrustNote className="mt-8" />
    </section>
  );
}
