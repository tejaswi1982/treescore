"use client";
import { useState } from "react";
import type { LocalityRecord } from "@/data/treeScoreSchema";
import { compareObservation } from "@/lib/treeScore";
import { ScoreCard } from "./ScoreCard";
import { TimelineChart } from "./TimelineChart";
export function ComparePanel({ localities }: { localities: LocalityRecord[] }) {
  const firstMeasured = localities.find((locality) => locality.currentMetrics);
  const secondMeasured = localities.find(
    (locality) => locality.currentMetrics && locality.id !== firstMeasured?.id,
  );
  const [idA, setA] = useState(firstMeasured?.id ?? localities[0]?.id ?? ""),
    [idB, setB] = useState(secondMeasured?.id ?? localities[1]?.id ?? "");
  const a = localities.find((l) => l.id === idA),
    b = localities.find((l) => l.id === idB);
  if (!a || !b)
    return (
      <p>At least two available analysis areas are needed for comparison.</p>
    );
  return (
    <div>
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {[
          { id: "a", label: "Locality A", value: idA, set: setA },
          { id: "b", label: "Locality B", value: idB, set: setB },
        ].map((s) => (
          <label key={s.id} className="text-sm">
            {s.label}
            <select
              className="mt-2 block w-full rounded-lg border border-line bg-cream p-3"
              value={s.value}
              onChange={(e) => s.set(e.target.value)}
            >
              {localities.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>
      <p
        className="mb-6 rounded-xl bg-leaf/60 p-5 text-sm leading-relaxed"
        role="status"
      >
        {compareObservation(a, b)}
      </p>
      <div className="grid gap-5 md:grid-cols-2">
        <ScoreCard locality={a} />
        <ScoreCard locality={b} />
        <TimelineChart
          series={a.historicalMetrics}
          title={`${a.name} · history`}
          compact
        />
        <TimelineChart
          series={b.historicalMetrics}
          title={`${b.name} · history`}
          compact
        />
      </div>
    </div>
  );
}
