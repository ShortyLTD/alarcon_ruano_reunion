import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Santa Cruz Reunion Kit — Bring everyone a little closer', description: 'Your Santa Cruz reunion, thoughtfully planned. Personalized weekends, researched local places, ready-to-send inquiries, budgets, and a guest guide.', robots: { index: false, follow: false } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body>{children}</body></html>; }
