import { localities } from "@/data/localities";
import { RankingTable } from "@/components/RankingTable";
export const metadata = { title: "TreeScore ranking policy" };
export default function RankingsPage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <p className="kicker text-moss">Mumbai · Beta</p>
      <h1 className="mt-5 font-serif text-4xl text-forest md:text-6xl">
        Rankings are not published yet.
      </h1>
      <p className="mb-10 mt-6 max-w-2xl text-sm leading-relaxed">
        TreeScore currently publishes two reviewed measurements. Rankings will
        be introduced after cross-locality calibration is validated; this beta
        does not represent every Mumbai locality.
      </p>
      <RankingTable localities={localities} />
    </section>
  );
}
