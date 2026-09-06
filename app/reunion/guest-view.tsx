'use client';

import { useEffect, useState } from 'react';
import { decodeGuestShareHash, renderGuestGuideHtml } from '@/lib/guest-guide';

export default function GuestView() {
  const [state, setState] = useState<{ html: string; failed: boolean }>({ html: '', failed: false });

  useEffect(() => {
    let active = true;
    let request = 0;
    async function openGuide() {
      const thisRequest = ++request;
      setState({ html: '', failed: false });
      const guide = await decodeGuestShareHash(window.location.hash);
      if (!active || thisRequest !== request) return;
      if (!guide) { setState({ html: '', failed: true }); return; }
      document.title = `${guide.family} · Together in Santa Cruz`;
      setState({ html: renderGuestGuideHtml(guide), failed: false });
    }
    void openGuide();
    window.addEventListener('hashchange', openGuide);
    return () => { active = false; window.removeEventListener('hashchange', openGuide); };
  }, []);

  if (state.html) return <iframe title="Your reunion guest guide" srcDoc={state.html} sandbox="allow-downloads allow-popups allow-popups-to-escape-sandbox allow-top-navigation-by-user-activation" referrerPolicy="no-referrer" style={{ display: 'block', border: 0, width: '100%', height: '100svh', background: '#f7f5ee' }} />;

  return <main style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', background: '#f7f5ee', color: '#193f3b', padding: 28 }}><div style={{ maxWidth: 490 }}><p style={{ fontSize: 11, letterSpacing: '.18em', fontWeight: 700 }}>SANTA CRUZ · TOGETHER AGAIN</p><h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(36px, 7vw, 52px)', fontWeight: 400, lineHeight: 1.1, margin: '22px 0' }}>{state.failed ? 'Let’s find your weekend.' : 'A little ocean air is on the way.'}</h1><p role="status" style={{ fontSize: 16, lineHeight: 1.7 }}>{state.failed ? 'This guest link is incomplete or could not be opened. Ask your organizer to copy a fresh link from their planner, and open the entire link in a current browser.' : 'Opening the guest guide your organizer shared with you…'}</p>{state.failed && <a href="/" style={{ display: 'inline-block', marginTop: 25, color: 'inherit', textUnderlineOffset: 4 }}>Visit Santa Cruz Reunion Kit →</a>}</div></main>;
}
