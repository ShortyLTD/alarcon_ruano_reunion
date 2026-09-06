import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Page not found', description: 'This page may have moved. Return to the Santa Cruz Reunion Kit planner or home page.', robots: { index: false, follow: true } };

export default function NotFound() {
  return <main className="guide-shell">
    <nav className="guide-nav" aria-label="Main navigation"><Link href="/">Santa Cruz Reunion Kit</Link><Link href="/guides">Local guides</Link></nav>
    <header className="guide-hero"><p className="guide-eyebrow">404 · PAGE NOT FOUND</p><h1>Let’s get you<br/>back to the plan.</h1><p>This page may have moved, or the link may be incomplete. Your saved reunion plan is still available in the browser where you created it.</p></header>
    <section className="guide-cta"><h2>Where would you like to start?</h2><p>Return to your planner, or explore the local research from the home page.</p><Link href="/plan">Open your planner →</Link><p><Link href="/">Back to the home page</Link></p></section>
  </main>;
}
