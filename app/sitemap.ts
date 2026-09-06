import type { MetadataRoute } from 'next';
import { guides, siteUrl } from '@/lib/guides';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl },
    { url: `${siteUrl}/our-reunion` },
    { url: `${siteUrl}/your-data` },
    { url: `${siteUrl}/guides` },
    ...guides.map((guide) => ({ url: `${siteUrl}/guides/${guide.slug}`, lastModified: guide.checkedAt })),
  ];
}
