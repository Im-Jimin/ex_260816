import type { MetadataRoute } from "next";
import { categories, items } from "@/lib/data";

const SITE_URL = "https://ex-260816-one.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/mypage`, changeFrequency: "weekly", priority: 0.4 },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/category/${category.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const itemEntries: MetadataRoute.Sitemap = items.map((item) => ({
    url: `${SITE_URL}/item/${item.id}`,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticEntries, ...categoryEntries, ...itemEntries];
}
