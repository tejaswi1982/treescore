"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import type { LocalityRecord } from "@/data/treeScoreSchema";
import { pointInPolygon } from "@/lib/geometry";
import { displayPercent, BOUNDARY_DISCLAIMER } from "@/lib/metrics";

export function MapPreview({
  localities,
  initialId,
}: {
  localities: LocalityRecord[];
  initialId?: string;
}) {
  const container = useRef<HTMLDivElement>(null),
    map = useRef<Leaflet.Map | null>(null);
  const layers = useRef(new Map<string, Leaflet.GeoJSON>());
  const pin = useRef<Leaflet.CircleMarker | null>(null);
  const [selected, setSelected] = useState(
    initialId ?? localities[0]?.id ?? "",
  );
  const [search, setSearch] = useState(""),
    [message, setMessage] = useState(
      "Tap a polygon or place a pin on the map.",
    ),
    [ready, setReady] = useState(false),
    [locating, setLocating] = useState(false);
  useEffect(() => {
    let cancelled = false;
    import("leaflet")
      .then((L) => {
        if (cancelled || !container.current) return;
        const m = L.map(container.current, {
          scrollWheelZoom: false,
          zoomAnimation: false,
          fadeAnimation: false,
        }).setView([19.115, 72.86], 12);
        map.current = m;
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
          .on("tileerror", () => {
            if (!cancelled)
              setMessage(
                "Basemap unavailable. Locality outlines and the selector still work.",
              );
          })
          .addTo(m);
        const bounds = L.latLngBounds([]);
        localities.forEach((l) => {
          const layer = L.geoJSON(l.boundary as GeoJSON.Feature, {
            style: {
              color: l.currentMetrics ? "#1f3a2d" : "#8a806f",
              weight: 2,
              fillColor: l.currentMetrics ? "#76916f" : "#d2c7b6",
              fillOpacity: l.currentMetrics ? 0.32 : 0.2,
            },
          }).addTo(m);
          layer.bindTooltip(
            `${l.name} · ${l.currentMetrics ? "Reviewed beta measurement" : "Analysis pending"}`,
          );
          layers.current.set(l.id, layer);
          bounds.extend(layer.getBounds());
        });
        if (bounds.isValid()) m.fitBounds(bounds, { padding: [24, 24] });
        m.on("click", (e) => {
          const found = localities.find((l) =>
            pointInPolygon([e.latlng.lng, e.latlng.lat], l.boundary.geometry),
          );
          pin.current?.remove();
          pin.current = L.circleMarker(e.latlng, {
            radius: 6,
            color: "#1f3a2d",
            fillOpacity: 1,
          }).addTo(m);
          setSelected(found?.id ?? "");
          setMessage(
            found
              ? `${found.name}: ${displayPercent(found.currentMetrics?.greenCoverPercent)}.`
              : "TreeScore hasn't measured this area yet.",
          );
        });
        setReady(true);
      })
      .catch(() =>
        setMessage("The map could not load. Use the locality selector below."),
      );
    const currentLayers = layers.current;
    return () => {
      cancelled = true;
      map.current?.stop();
      map.current?.remove();
      map.current = null;
      currentLayers.clear();
    };
  }, [localities]);
  useEffect(() => {
    layers.current.forEach((layer, id) => {
      const locality = localities.find((item) => item.id === id);
      layer.setStyle({
        weight: id === selected ? 3 : 2,
        color:
          id === selected
            ? "#1f3a2d"
            : locality?.currentMetrics
              ? "#6b7f6a"
              : "#9b927f",
        fillColor: locality?.currentMetrics ? "#76916f" : "#d2c7b6",
        fillOpacity: id === selected ? 0.45 : locality?.currentMetrics ? 0.25 : 0.14,
      });
    });
  }, [selected, ready]);
  const chosen = localities.find((l) => l.id === selected);
  function choose(id: string) {
    setSelected(id);
    const layer = layers.current.get(id);
    if (layer)
      map.current?.fitBounds(layer.getBounds(), {
        padding: [35, 35],
        maxZoom: 14,
      });
  }
  function locate() {
    if (!navigator.geolocation) {
      setMessage(
        "Your browser does not support location. Select an area instead.",
      );
      return;
    }
    setLocating(true);
    setMessage("Finding your location…");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const { longitude, latitude, accuracy } = position.coords;
        const found = localities.find((l) =>
          pointInPolygon([longitude, latitude], l.boundary.geometry),
        );
        if (found) choose(found.id);
        else setSelected("");
        setMessage(
          found
            ? `${found.name}: ${displayPercent(found.currentMetrics?.greenCoverPercent)}. Location accuracy is approximately ${Math.round(accuracy)} m; confirm the boundary if you are near its edge.`
            : "TreeScore hasn't measured this area yet. Location is approximate; you can also select an analysis area.",
        );
      },
      (error) => {
        setLocating(false);
        setMessage(
          error.code === 1
            ? "Location permission was denied. You can select an area instead."
            : "Location unavailable. Try again or select an area.",
        );
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 0 },
    );
  }
  return (
    <section
      className="overflow-hidden rounded-2xl border border-line bg-cream"
      aria-label="Mumbai analysis area map"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line p-4">
        <p className="kicker text-moss">Mumbai · Analysis areas</p>
        <button
          onClick={locate}
          disabled={locating}
          className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-50"
        >
          {locating ? "Locating…" : "Use my location"}
        </button>
      </div>
      <div
        ref={container}
        className="relative z-0 h-[350px] w-full md:h-[420px]"
        aria-label="Interactive map. Use the locality selector for keyboard access."
      />
      <div className="space-y-4 p-5">
        <label className="block text-sm">
          Search localities
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Mumbai beta areas"
            className="mt-2 w-full rounded-lg border border-line bg-paper p-3"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {localities
            .filter((l) => l.name.toLowerCase().includes(search.toLowerCase()))
            .map((l) => (
              <button
                key={l.id}
                onClick={() => choose(l.id)}
                aria-pressed={selected === l.id}
                className={`rounded-full border px-3 py-2 text-sm ${selected === l.id ? "border-forest bg-forest text-cream" : "border-line"}`}
              >
                {l.name}
              </button>
            ))}
        </div>
        {!localities.some((l) =>
          l.name.toLowerCase().includes(search.toLowerCase()),
        ) && <p className="text-sm">No matching analysis areas.</p>}
        {chosen && (
          <Link
            className="block rounded-lg bg-sand p-4 text-sm"
            href={`/locality/${chosen.id}`}
          >
            <strong>{chosen.name}</strong>
            <span className="mt-1 block">
              {displayPercent(chosen.currentMetrics?.greenCoverPercent)} · View
              details →
            </span>
          </Link>
        )}
        <p role="status" className="text-sm leading-relaxed">
          {message}
        </p>
        <p className="text-xs leading-relaxed text-moss-deep">
          {BOUNDARY_DISCLAIMER} Your location is checked in this browser and is
          not stored or sent to TreeScore.
        </p>
      </div>
    </section>
  );
}
