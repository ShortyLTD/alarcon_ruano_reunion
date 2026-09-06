import type { MetadataRoute } from 'next';
import { guides } from '@/lib/guides';
import { researchCheckedAt, siteUrl } from '@/lib/site';

// Static marketing and guide routes. /plan is intentionally excluded because it is noindex.
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date(researchCheckedAt);
  return [
    { url: siteUrl, lastModified: updated, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/our-reunion`, lastModified: updated, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${siteUrl}/guides`, lastModified: updated, changeFrequency: 'weekly', priority: 0.8 },
    ...guides.map((guide) => ({ url: `${siteUrl}/guides/${guide.slug}`, lastModified: new Date(guide.checkedAt), changeFrequency: 'monthly' as const, priority: 0.8 })),
    { url: `${siteUrl}/blueprint`, lastModified: updated, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${siteUrl}/for-sale`, lastModified: updated, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${siteUrl}/your-data`, lastModified: updated, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
