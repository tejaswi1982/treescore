import { localities } from "@/data/localities";
import { TimelineChart } from "@/components/TimelineChart";
import { TrustNote } from "@/components/TrustNote";
export const metadata = { title: "Green cover change since 2015" };
export default function HistoryPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <p className="kicker text-moss">Memory</p>
      <h1 className="mt-5 max-w-3xl font-serif text-4xl text-forest md:text-6xl">
        Green cover change since 2015
      </h1>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed">
        The baseline is the November 2015–February 2016 dry season, compared
        with matching windows in later years. Historical results use one
        consistent imagery collection and a shared observed land mask. Early
        imagery may be insufficient for a defensible baseline.
      </p>
      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {localities.map((l) => (
          <TimelineChart
            key={l.id}
            series={l.historicalMetrics}
            title={l.name}
          />
        ))}
      </div>
      <TrustNote className="mt-8" />
    </section>
  );
}
