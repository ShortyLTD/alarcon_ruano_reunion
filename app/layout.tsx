import type { Metadata } from 'next';
import { analyticsEnabled, siteName, siteUrl } from '@/lib/site';
import './globals.css';

// Page-level files own their canonical URL and robots directives so that the
// 404 page and other non-indexable routes do not inherit the homepage values.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'Santa Cruz Family Reunion Planner: Hotels, Venues & Dining', template: `%s | ${siteName}` },
  description: 'Plan a Santa Cruz family reunion with researched hotels, group dining and gathering spaces, ready-to-send inquiries and a guest guide. Free working preview.',
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'website', locale: 'en_US', siteName, title: 'Your Santa Cruz reunion. A lot less to figure out.', description: 'Researched local places, ready-to-send inquiries and a personalized reunion plan. Explore the free working preview.', images: [{ url: '/images/santa-cruz-coast.jpg', width: 1100, height: 825, alt: 'Pacific waves along the Santa Cruz coast' }] },
  twitter: { card: 'summary_large_image' },
};

const organization = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Organization', '@id': `${siteUrl}/#organization`, name: siteName, url: `${siteUrl}/`, logo: `${siteUrl}/favicon.svg` },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, name: siteName, url: `${siteUrl}/`, publisher: { '@id': `${siteUrl}/#organization` } },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Vercel Web Analytics queues events until its script loads; no npm dependency is needed.
  return <html lang="en"><body>{analyticsEnabled && <script dangerouslySetInnerHTML={{ __html: 'window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)};' }}/>}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, '\\u003c') }}/>{children}{analyticsEnabled && <script defer src="/_vercel/insights/script.js"/>}</body></html>;
}
