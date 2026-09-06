// Site-wide configuration. Values come from public environment variables so the
// canonical origin, contact address and analytics can change without a code edit.
// NEXT_PUBLIC_* variables are inlined at build time on Vercel.

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://santa-cruz-reunion-kit.vercel.app';

/** Canonical origin without a trailing slash, e.g. https://santa-cruz-reunion-kit.vercel.app */
export const siteUrl = rawSiteUrl.replace(/\/+$/, '');

export const siteName = 'Santa Cruz Reunion Kit';

/** Date the local research and guides were last checked against official sources. */
export const researchCheckedAt = '2026-09-06';
export const researchCheckedLabel = 'September 6, 2026';

/** Planned first paid price. Checkout is not connected in this release. */
export const plannedPrice = 39;

/** Optional public contact address. When empty, contact and notify-me links are not rendered. */
export const contactEmail = (process.env.NEXT_PUBLIC_CONTACT_EMAIL || '').trim();

/** Vercel Web Analytics is loaded only when explicitly enabled for the deployment. */
export const analyticsEnabled = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === '1';

export function mailto(subject: string, body = ''): string {
  return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
}
