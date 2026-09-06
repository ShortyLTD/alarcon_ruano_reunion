export type FunnelEvent =
  | 'preview_started'
  | 'plan_built'
  | 'inquiry_opened'
  | 'inquiry_copied'
  | 'sample_viewed'
  | 'sample_downloaded'
  | 'kit_downloaded'
  | 'guest_guide_downloaded'
  | 'launch_notify_clicked';

type VercelAnalytics = { va?: (event: 'event', payload: { name: string; data?: Record<string, string | number | boolean> }) => void };

/**
 * Records a product funnel step in Vercel Web Analytics (cookieless, no personal data).
 * The analytics script is only loaded when NEXT_PUBLIC_VERCEL_ANALYTICS=1 (see app/layout.tsx);
 * otherwise window.va is undefined and this is a no-op, so the planner behaves identically.
 * Never pass names, emails, notes, or free text.
 */
export function track(event: FunnelEvent, data?: Record<string, string | number | boolean>) {
  try { (window as unknown as VercelAnalytics).va?.('event', { name: event, data }); } catch { /* analytics must never break the planner */ }
}
