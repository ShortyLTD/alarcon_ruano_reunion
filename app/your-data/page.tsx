import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Your Plan and Your Data',
  description: 'How the Santa Cruz Reunion Kit preview saves your plan, prepares emails and exports your guest guide.',
  alternates: { canonical: '/your-data' },
  openGraph: { title: 'Your Plan and Your Data', description: 'Understand what is saved on your device and what you choose to share.', url: '/your-data', images: [{ url: '/images/santa-cruz-coast.jpg', alt: 'Santa Cruz coast' }] },
};

export default function YourData() {
  return <main className="guide-shell">
    <nav className="guide-nav" aria-label="Main navigation"><Link href="/">Santa Cruz Reunion Kit</Link><Link href="/plan">Your planner →</Link></nav>
    <header className="guide-hero"><p className="guide-eyebrow">ABOUT THE WORKING PREVIEW</p><h1>Your plan.<br/>Know where it lives.</h1><p>You can use the preview without an account. Here is how saving, outreach and sharing work in this version.</p><p className="guide-byline">Updated September 6, 2026</p></header>
    <section className="guide-section"><h2>Saved in this browser</h2><p>Your reunion details, notes, shortlist, schedule, draft messages and quote records save in this browser’s local storage after you build a plan. The planner does not upload that working plan to our server. Anyone with access to this browser profile may be able to open it. Clearing site data removes the browser’s saved copy.</p></section>
    <section className="guide-section"><h2>Your backup contains organizer details</h2><p>The complete kit and restorable backup include your private planning notes and budget. Keep them for yourself or trusted co-organizers. Download a fresh backup before moving devices or clearing browser data.</p></section>
    <section className="guide-section"><h2>Choose the guest guide when sharing</h2><p>The separate guest guide contains your welcome message, weekend schedule and organizer email when provided. It leaves out the budget, quotes and private planning notes. Review the schedule and contact details before sharing the file. It is a snapshot; download and resend it when plans change.</p></section>
    <section className="guide-section"><h2>You control the outreach</h2><p>Messages are prepared for your review. Opening an email draft passes its recipient, subject and text to your chosen email app. Copying an inquiry puts it on your clipboard. You decide what to send or submit on a provider’s website. Replies and email RSVPs go to your inbox; the preview does not collect or track them.</p></section>
    <section className="guide-section"><h2>Optional dictation uses your browser</h2><p>If you choose to dictate a note, your browser’s speech service handles voice input and microphone permission. Its processing depends on your browser and service settings. You can type every detail instead.</p></section>
    <section className="guide-section"><h2>Website visits and external services</h2><p>Vercel hosts the site and may process request information to deliver and secure it. We have not connected advertising trackers or product conversion analytics in this preview. Provider links, email apps and browser speech services operate under their own data practices. This page describes the current preview; it does not mean a website visit produces no hosting logs.</p></section>
    <footer className="guide-footer"><Link href="/">Back to Santa Cruz Reunion Kit</Link></footer>
  </main>;
}
