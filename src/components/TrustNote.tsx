import { BOUNDARY_DISCLAIMER } from "@/lib/metrics";
export function TrustNote({
  tone = "dark",
  className = "",
}: {
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <p
      className={`max-w-2xl text-xs leading-relaxed ${tone === "light" ? "text-cream/80" : "text-moss-deep"} ${className}`}
    >
      Green-cover estimates are satellite-derived NDVI-based proxies that
      capture vegetation, not exact tree counts. {BOUNDARY_DISCLAIMER}
    </p>
  );
}
