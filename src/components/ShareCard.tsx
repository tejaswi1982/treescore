"use client";
import { useState } from "react";
import type { LocalityRecord } from "@/data/treeScoreSchema";
import {
  displayPercent,
  MEASUREMENT_LABEL,
  BOUNDARY_DISCLAIMER,
} from "@/lib/metrics";
export function ShareCard({ locality: l }: { locality: LocalityRecord }) {
  const [message, setMessage] = useState("");
  async function share(copy = false) {
    const url = new URL(`/locality/${l.id}`, window.location.origin).href;
    try {
      if (!copy && navigator.share)
        await navigator.share({
          title: `${l.name} · TreeScore`,
          text: `${MEASUREMENT_LABEL}: ${displayPercent(l.currentMetrics?.greenCoverPercent)}. ${BOUNDARY_DISCLAIMER}`,
          url,
        });
      else {
        await navigator.clipboard.writeText(url);
        setMessage("Link copied.");
      }
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError"))
        setMessage(`Share unavailable. Copy this link: ${url}`);
    }
  }
  return (
    <div className="rounded-2xl bg-forest-deep p-7 text-cream">
      <h3 className="font-serif text-2xl">{l.name}</h3>
      <p className="mt-4 text-sm">{MEASUREMENT_LABEL}</p>
      <p className="mt-3 font-serif text-3xl">
        {displayPercent(l.currentMetrics?.greenCoverPercent)}
      </p>
      <p className="mt-5 text-xs leading-relaxed text-cream/80">
        {BOUNDARY_DISCLAIMER}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          className="rounded-full bg-cream px-5 py-3 text-sm text-forest"
          onClick={() => share()}
        >
          Share locality
        </button>
        <button
          className="rounded-full border border-cream/60 px-5 py-3 text-sm"
          onClick={() => share(true)}
        >
          Copy link
        </button>
      </div>
      <p role="status" className="mt-3 break-all text-sm">
        {message}
      </p>
    </div>
  );
}
