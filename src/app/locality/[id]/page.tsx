import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLocality, localities } from "@/data/localities";
import { ScoreCard } from "@/components/ScoreCard";
import { LocalityCard } from "@/components/LocalityCard";
import { TimelineChart } from "@/components/TimelineChart";
import { ShareCard } from "@/components/ShareCard";
import { MapPreview } from "@/components/MapPreview";
import { TrustNote } from "@/components/TrustNote";
import { MEASUREMENT_LABEL, displayPercent } from "@/lib/metrics";
// Only configured analysis areas have public locality routes.
export const dynamicParams = false;
export function generateStaticParams() {
  return localities.map((l) => ({ id: l.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const l = getLocality((await params).id);
  if (!l) return { title: "Area unavailable" };
  const title = `${l.name} · TreeScore`,
    description = `${MEASUREMENT_LABEL}: ${displayPercent(l.currentMetrics?.greenCoverPercent)}. TreeScore-defined analysis area, not an official administrative boundary.`;
  return {
    title: l.name,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary", title, description },
  };
}
export default async function LocalityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const l = getLocality((await params).id);
  if (!l) notFound();
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-20">
      <p className="kicker text-moss">Mumbai · Beta</p>
      <h1 className="mt-5 font-serif text-4xl text-forest md:text-6xl">
        {l.name}
      </h1>
      <div className="mt-10 grid items-start gap-6 lg:grid-cols-2">
        <ScoreCard locality={l} />
        <MapPreview localities={localities} initialId={l.id} />
      </div>
      <h2 className="mb-6 mt-14 font-serif text-3xl text-forest">
        Other available areas
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {localities
          .filter((p) => p.id !== l.id)
          .map((p) => (
            <LocalityCard key={p.id} locality={p} />
          ))}
      </div>
      <div className="mt-12">
        <TimelineChart series={l.historicalMetrics} title="Change since 2015" />
      </div>
      <TrustNote className="my-8" />
      <ShareCard locality={l} />
    </section>
  );
}
