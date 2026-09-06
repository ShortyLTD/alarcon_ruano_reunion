import type { Metadata } from 'next';
import GuestView from './guest-view';

export const metadata: Metadata = {
  title: 'Your family, together in Santa Cruz',
  description: 'A coastal weekend with your favorite people. Open your organizer’s guest link for your reunion schedule and RSVP details.',
  robots: { index: false, follow: false },
};

export default function ReunionGuestPage() {
  return <GuestView />;
}
