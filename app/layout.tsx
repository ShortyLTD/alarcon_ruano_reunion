import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://santa-cruz-reunion-kit.vercel.app'),
  title: { default: 'Santa Cruz Family Reunion Planning Kit | Local Research & Outreach', template: '%s | Santa Cruz Reunion Kit' },
  description: 'Plan your Santa Cruz family reunion with researched hotels, group dining, gathering spaces, editable inquiries, and a guest guide. Explore the working preview.',
  alternates: { canonical: '/' }, robots: { index: true, follow: true },
  icons: { icon: '/favicon.svg' },
  openGraph: { type: 'website', locale: 'en_US', url: '/', siteName: 'Santa Cruz Reunion Kit', title: 'Your Santa Cruz reunion. A lot less to figure out.', description: 'Local research, ready-to-use outreach, and a personalized reunion packet. Explore the working preview.', images: [{ url: '/images/santa-cruz-coast.jpg', width: 1100, height: 733, alt: 'Pacific waves along the Santa Cruz coast' }] },
  twitter: { card: 'summary_large_image' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'WebSite', name: 'Santa Cruz Reunion Kit', url: 'https://santa-cruz-reunion-kit.vercel.app/' }) }}/>{children}</body></html>; }
