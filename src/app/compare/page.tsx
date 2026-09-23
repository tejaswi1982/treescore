import { localities } from "@/data/localities";
import { ComparePanel } from "@/components/ComparePanel";
import { TrustNote } from "@/components/TrustNote";
export const metadata = { title: "Compare analysis areas" };
export default function ComparePage() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-14 md:px-8 md:py-20">
      <p className="kicker text-moss">Compare</p>
      <h1 className="mt-5 font-serif text-4xl text-forest md:text-6xl">
        Two areas, side by side.
      </h1>
      <p className="mb-10 mt-6 max-w-xl text-sm leading-relaxed">
        Compare satellite-derived green cover estimates across the available
        Mumbai analysis areas. Each uses reviewed locality calibration under the
        same Level-1 processing family; no winner or rank is assigned in this beta.
      </p>
      <ComparePanel localities={localities} />
      <TrustNote className="mt-8" />
    </section>
  );
}
