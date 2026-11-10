import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Opening from './components/Opening';
import Invitation from './components/Invitation';
import MusicToggle from './components/MusicToggle';

gsap.registerPlugin(ScrollTrigger);

// Prepare every ink stroke for a "drawn by hand" reveal.
function primeInk(scope) {
  scope.querySelectorAll('.sketch .ink, .divider .ink, .monogram .ink').forEach((el) => {
    let len = 0;
    try { len = el.getTotalLength(); } catch { len = 0; }
    if (!len) return;
    el.style.strokeDasharray = `${len} ${len}`;
    el.style.strokeDashoffset = `${len}`;
  });
}

function drawIn(el, delay = 0) {
  const inks = el.querySelectorAll('.ink');
  const washes = el.querySelectorAll('.wash');
  const letters = el.querySelectorAll('.mono-letters');
  const tl = gsap.timeline({ delay });
  if (inks.length) tl.to(inks, { strokeDashoffset: 0, duration: 1.8, ease: 'power1.inOut', stagger: { amount: 0.8 } }, 0);
  if (washes.length) tl.fromTo(washes, { opacity: 0 }, { opacity: (i, t) => t.getAttribute('opacity') || 0.55, duration: 1.2 }, 0.9);
  if (letters.length) tl.fromTo(letters, { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0.5);
  return tl;
}

export default function App() {
  const [phase, setPhase] = useState('opening'); // opening -> revealing -> done
  const [gate, setGate] = useState(false);
  const [round, setRound] = useState(0);
  const inviteRef = useRef(null);

  // Lock page scroll while the envelope sequence plays.
  useEffect(() => {
    document.documentElement.classList.toggle('locked', phase !== 'done');
  }, [phase]);

  useLayoutEffect(() => {
    const el = inviteRef.current;
    primeInk(el);
    gsap.set(el.querySelectorAll('.hero-item'), { opacity: 0, y: 18 });
    gsap.set(el.querySelectorAll('.washes, .sketch .wash'), { opacity: 0 });
    gsap.set(el.querySelectorAll('.mono-letters'), { opacity: 0 });
  }, [round]);

  const onRevealStart = useCallback(() => {
    setPhase('revealing');
    const el = inviteRef.current;
    gsap.fromTo(el.querySelector('.hero'), { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.2, ease: 'power2.out' });
    gsap.fromTo(el.querySelector('.hero-canopy'), { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: 'power2.out', delay: 0.4 });
    gsap.fromTo(el.querySelector('.hero-bed'), { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 2, ease: 'power2.out', delay: 0.5 });
    gsap.to(el.querySelectorAll('.hero-item'), { opacity: 1, y: 0, duration: 1.1, ease: 'power2.out', stagger: 0.16, delay: 0.9 });
    drawIn(el.querySelector('.hero .monogram'), 0.9);
  }, []);

  const onDone = useCallback(() => setPhase('done'), []);

  // Scroll-driven reveals for the pages below the hero.
  useEffect(() => {
    if (phase !== 'done') return;
    const el = inviteRef.current;
    const ctx = gsap.context(() => {
      el.querySelectorAll('.reveal').forEach((node) => {
        gsap.fromTo(node, { opacity: 0, y: 26 }, {
          opacity: 1, y: 0, duration: 1, ease: 'power2.out',
          scrollTrigger: { trigger: node, start: 'top 90%', once: true },
          onStart: () => { if (node.querySelector('.ink') || node.classList.contains('divider') || node.classList.contains('monogram')) drawIn(node, 0.1); },
        });
      });
      el.querySelectorAll('.corner').forEach((c) => {
        gsap.fromTo(c, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out', scrollTrigger: { trigger: c, start: 'top 95%', once: true } });
      });
      gsap.to(el.querySelector('.hero-canopy'), { yPercent: -12, ease: 'none', scrollTrigger: { trigger: el.querySelector('.hero'), start: 'top top', end: 'bottom top', scrub: true } });
    }, el);
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, [phase, round]);

  const replay = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setGate(false);
    setPhase('opening');
    setRound((n) => n + 1);
  }, []);

  return (
    <main className="stage">
      <Invitation key={round} ref={inviteRef} onReplay={replay} />
      {phase !== 'done' && (
        <Opening key={`o${round}`} onGateStart={() => setGate(true)} onRevealStart={onRevealStart} onDone={onDone} />
      )}
      <MusicToggle visible={gate || phase === 'done'} />
    </main>
  );
}
