import type { MetadataRoute } from "next";
import { problems } from "@/data/problems";

export default function sitemap(): MetadataRoute.Sitemap {
  const problemUrls = problems.map((p) => ({
    url: `https://learn.tokamak.network/problems/${p.id}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: "https://learn.tokamak.network",
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://learn.tokamak.network/daily",
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://learn.tokamak.network/language/solidity",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...problemUrls,
  ];
}
