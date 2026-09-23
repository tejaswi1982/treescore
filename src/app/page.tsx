import Link from "next/link";
import { HeroSection } from "@/components/HeroSection";
import { SectionIntro } from "@/components/SectionIntro";
import { LocalityCard } from "@/components/LocalityCard";
import { RankingTable } from "@/components/RankingTable";
import { MethodologyBlock } from "@/components/MethodologyBlock";
import { MapPreview } from "@/components/MapPreview";
import { localities } from "@/data/localities";
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <section
        id="explore"
        className="mx-auto max-w-6xl scroll-mt-20 px-5 py-12 md:px-8 md:py-20"
      >
        <SectionIntro
          label="Mumbai beta"
          title="Explore the analysis areas."
          copy="Andheri West Core and Juhu have reviewed measurements. Powai Lake + Urban Area remains analysis pending."
        />
        <MapPreview localities={localities} />
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {localities.map((l) => (
            <LocalityCard key={l.id} locality={l} />
          ))}
        </div>
        <Link
          href="/compare"
          className="mt-7 inline-block text-sm underline underline-offset-4"
        >
          Compare available areas →
        </Link>
      </section>
      <section className="border-y border-line bg-sand/40">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
          <SectionIntro
            label="Two measured areas"
            title="Reviewed measurements, with rankings withheld"
            link={{ href: "/rankings", label: "Read ranking policy" }}
          />
          <RankingTable localities={localities} />
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">
        <SectionIntro
          label="Memory"
          title="How has green cover changed since 2015?"
          copy="Equivalent seasonal windows. Reviewed observations. No assumed loss or gain."
          link={{ href: "/history", label: "Explore historical coverage" }}
        />
        <MethodologyBlock />
      </section>
    </>
  );
}
