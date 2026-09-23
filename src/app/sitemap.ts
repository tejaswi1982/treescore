import type { MetadataRoute } from "next";
import { localities } from "@/data/localities";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/compare", "/history", "/methodology", "/rankings"];
  return [
    ...routes.map((path) => ({ url: new URL(path || "/", siteUrl).toString() })),
    ...localities.map((locality) => ({
      url: new URL(`/locality/${locality.id}`, siteUrl).toString(),
    })),
  ];
}
