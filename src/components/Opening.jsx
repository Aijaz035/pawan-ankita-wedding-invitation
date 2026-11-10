import { useLayoutEffect, useRef, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';
import paper from '../assets/paper.webp';
import seal from '../assets/seal.webp';
import gatebg from '../assets/gatebg.webp';
import arch from '../assets/arch.webp';
import { groom, bride } from '../data/wedding';
import { unlockAudio, playMusic, sfx } from '../hooks/sound';
import { Petals } from './Ornaments';

// ---------- Satin curtains (procedural folds) ----------
const KNOT = { x: 500, y: 1000 };
function curtainBands() {
  const N = 14;
  const line = (i) => {
    const tx = 176 + (i * 324) / N;
    const px = 438 + (i * 62) / N;
    const py = KNOT.y + (i - N / 2) * 5;
    return { tx, px, py, bx: 150 + (i * 350) / N };
  };
  const bands = [];
  for (let i = 0; i < N; i++) {
    const a = line(i), b = line(i + 1);
    const d = `M${a.tx} 400 C${a.tx} 760 ${a.px - 20} ${a.py - 160} ${a.px} ${a.py} C${a.px - 20} ${a.py + 220} ${a.bx} 1400 ${a.bx} 1800
      L${b.bx} 1800 C${b.bx} 1400 ${b.px - 20} ${b.py + 220} ${b.px} ${b.py} C${b.px - 20} ${b.py - 160} ${b.tx} 760 ${b.tx} 400Z`;
    const hl = `M${(a.tx + b.tx) / 2} 400 C${(a.tx + b.tx) / 2} 760 ${(a.px + b.px) / 2 - 20} ${a.py - 160} ${(a.px + b.px) / 2} ${a.py} C${(a.px + b.px) / 2 - 20} ${a.py + 220} ${(a.bx + b.bx) / 2} 1400 ${(a.bx + b.bx) / 2} 1800`;
    bands.push({ d, hl, i });
  }
  return bands;
}
const BANDS = curtainBands();
const BAND_FILLS = ['#efcbc5', '#e9bfb8', '#f3d4ce', '#e6bab3', '#f1cfc9', '#eac1ba', '#f4d7d1', '#e4b6af', '#efccc6', '#e8beb7', '#f2d2cc', '#e5b8b1', '#f0cec8', '#e9c0b9'];

function CurtainHalf({ innerRef, mirror }) {
  return (
    <g ref={innerRef} transform={mirror ? 'translate(1000 0) scale(-1 1)' : undefined}>
      <g className="curtain-inner">
        {BANDS.map((b) => (
          <g key={b.i}>
            <path d={b.d} fill={BAND_FILLS[b.i]} />
            <path d={b.hl} fill="none" stroke="#fff6f3" strokeOpacity={b.i % 3 === 0 ? 0.28 : 0.12} strokeWidth={b.i % 3 === 0 ? 14 : 6} strokeLinecap="round" />
          </g>
        ))}
        <rect x="150" y="400" width="360" height="1400" fill="url(#c-shade)" />
      </g>
    </g>
  );
}

function Bow({ refs }) {
  return (
    <g className="bow" filter="url(#bow-shadow)" transform="translate(500 1000) scale(1.3) translate(-500 -1000)">
      <g ref={refs.tailL}>
        <path d="M492 1012 C474 1090 448 1170 404 1262 L440 1250 L458 1282 C486 1180 500 1090 506 1016Z" fill="url(#satin-v)" />
        <path d="M496 1030 C482 1100 462 1170 432 1240" stroke="#fff4f1" strokeOpacity="0.6" strokeWidth="4" fill="none" />
      </g>
      <g ref={refs.tailR}>
        <path d="M508 1012 C530 1080 562 1150 618 1236 L582 1230 L570 1264 C532 1170 506 1090 496 1016Z" fill="url(#satin-v)" />
        <path d="M508 1030 C526 1090 552 1150 590 1214" stroke="#fff4f1" strokeOpacity="0.5" strokeWidth="4" fill="none" />
      </g>
      <g ref={refs.loopL}>
        <path d="M500 1000 C452 944 352 896 318 938 C288 978 318 1050 380 1050 C430 1050 476 1022 500 1000Z" fill="url(#satin-l)" />
        <path d="M494 996 C440 958 370 936 344 960" stroke="#fff6f2" strokeOpacity="0.75" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M494 1006 C450 1030 400 1040 368 1032" stroke="#b97f78" strokeOpacity="0.5" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      <g ref={refs.loopR}>
        <path d="M500 1000 C548 944 648 896 682 938 C712 978 682 1050 620 1050 C570 1050 524 1022 500 1000Z" fill="url(#satin-r)" />
        <path d="M506 996 C560 958 630 936 656 960" stroke="#fff6f2" strokeOpacity="0.75" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M506 1006 C550 1030 600 1040 632 1032" stroke="#b97f78" strokeOpacity="0.5" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      <g ref={refs.knot}>
        <ellipse cx="500" cy="1002" rx="30" ry="34" fill="url(#satin-k)" />
        <path d="M486 984 C494 1000 494 1010 488 1026" stroke="#fff6f2" strokeOpacity="0.7" strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

export default function Opening({ onGateStart, onRevealStart, onDone }) {
  const root = useRef(null);
  const r = {
    flap: useRef(null), flapShadow: useRef(null), sealWrap: useRef(null), sealL: useRef(null), sealR: useRef(null),
    pocket: useRef(null), back: useRef(null), card: useRef(null), envText: useRef(null),
    cover: useRef(null), curtL: useRef(null), curtR: useRef(null), gateText: useRef(null),
    tailL: useRef(null), tailR: useRef(null), loopL: useRef(null), loopR: useRef(null), knot: useRef(null),
  };
  const [phase, setPhase] = useState('envelope'); // envelope -> opening -> gate -> untie
  const busy = useRef(false);
  const phaseRef = useRef('envelope');
  phaseRef.current = phase;

  // Intro + idle
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(r.card.current, { yPercent: 5, scale: 0.86, borderRadius: 18 });
      gsap.from(root.current.querySelector('.env'), { scale: 1.06, opacity: 0, duration: 1.4, ease: 'power2.out' });
      gsap.from(r.sealWrap.current, { scale: 1.5, opacity: 0, duration: 0.9, delay: 0.7, ease: 'back.out(1.6)' });
      gsap.from(r.envText.current.children, { y: 14, opacity: 0, duration: 1, stagger: 0.18, delay: 1.0, ease: 'power2.out' });
      gsap.to(r.sealWrap.current, { scale: 1.04, duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.8 });
    }, root);
    return () => ctx.revert();
  }, []);

  const openEnvelope = useCallback(() => {
    if (busy.current || phaseRef.current !== 'envelope') return;
    busy.current = true;
    phaseRef.current = 'opening';
    unlockAudio();
    playMusic();
    sfx('seal');
    setPhase('opening');
    gsap.killTweensOf(r.sealWrap.current);
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => { busy.current = false; setPhase('gate'); onGateStart?.(); },
    });
    tl.set(r.sealWrap.current, { pointerEvents: 'none' })
      .to(r.sealWrap.current, { scale: 1.08, duration: 0.12, ease: 'power1.out' })
      .to(r.sealL.current, { x: -38, y: 70, rotation: -28, opacity: 0, duration: 0.75, ease: 'power2.in' }, '>')
      .to(r.sealR.current, { x: 38, y: 76, rotation: 24, opacity: 0, duration: 0.75, ease: 'power2.in' }, '<')
      .to(r.envText.current, { opacity: 0, y: 20, duration: 0.5 }, '<')
      .add(() => sfx('paper'), '-=0.35')
      .to(r.flap.current, { rotationX: 180, duration: 1.25, ease: 'power2.inOut' }, '-=0.35')
      .to(r.flapShadow.current, { opacity: 0, duration: 0.5 }, '<')
      .set(r.flap.current, { zIndex: 1 }, '-=0.62')
      .to(r.card.current, { yPercent: -7, duration: 1.0, ease: 'power2.out' }, '-=0.15')
      .add(() => sfx('paper'))
      .to(r.pocket.current, { yPercent: 105, duration: 1.15, ease: 'power3.in' }, '+=0.05')
      .to([r.back.current, r.flap.current], { opacity: 0, duration: 0.9 }, '<+0.25')
      .to(r.card.current, { yPercent: 0, scale: 1, borderRadius: 0, duration: 1.3, ease: 'power3.inOut' }, '<');
  }, [onGateStart]);

  const untie = useCallback(() => {
    if (busy.current || phaseRef.current !== 'gate') return;
    busy.current = true;
    phaseRef.current = 'untie';
    setPhase('untie');
    sfx('chime');
    const tl = gsap.timeline({ onComplete: () => onDone?.() });
    tl.to([r.loopL.current], { scale: 0.1, rotation: -40, opacity: 0, svgOrigin: `${KNOT.x} ${KNOT.y}`, duration: 0.85, ease: 'power2.in' })
      .to([r.loopR.current], { scale: 0.1, rotation: 40, opacity: 0, svgOrigin: `${KNOT.x} ${KNOT.y}`, duration: 0.85, ease: 'power2.in' }, '<')
      .to([r.tailL.current, r.tailR.current], { y: 160, opacity: 0, duration: 0.9, ease: 'power2.in' }, '<+0.1')
      .to(r.knot.current, { scale: 0, opacity: 0, svgOrigin: `${KNOT.x} ${KNOT.y}`, duration: 0.5, ease: 'back.in(2)' }, '<+0.35')
      .add(() => sfx('paper'), '<')
      .to(r.curtL.current.querySelector('.curtain-inner'), { scaleX: 0.16, transformOrigin: '0% 50%', duration: 1.8, ease: 'power3.inOut' }, '-=0.15')
      .to(r.curtR.current.querySelector('.curtain-inner'), { scaleX: 0.16, transformOrigin: '0% 50%', duration: 1.8, ease: 'power3.inOut' }, '<')
      .to(r.gateText.current, { y: -30, opacity: 0, duration: 1.1, ease: 'power2.in' }, '-=0.6')
      .add(() => onRevealStart?.(), '-=0.2')
      .to(r.cover.current, { scale: 2.5, duration: 1.6, ease: 'power2.in', transformOrigin: '50% 50%' }, '-=0.3')
      .to(r.card.current, { opacity: 0, duration: 0.9, ease: 'power1.in' }, '-=0.95');
  }, [onDone, onRevealStart]);

  // Auto-advance the ribbon gate if the guest doesn't tap.
  useEffect(() => {
    if (phase !== 'gate') return;
    const id = setTimeout(untie, 3800);
    return () => clearTimeout(id);
  }, [phase, untie]);

  const paperBg = { backgroundImage: `url(${paper})` };

  return (
    <div className="opening" ref={root}>
      <div className="env" onClick={openEnvelope}>
        <div className="env-back" ref={r.back} style={paperBg} />

        {/* The card inside the envelope: the floral ribbon gate */}
        <div className="gate-card" ref={r.card} onClick={(e) => { if (phaseRef.current === 'gate') { e.stopPropagation(); untie(); } }}>
          <div className="cover" ref={r.cover}>
            <img className="layer" src={gatebg} alt="" draggable="false" />
            <svg className="layer" viewBox="0 0 1000 1800" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <clipPath id="arch-clip"><path d="M176 1800 V760 A324 324 0 0 1 824 760 V1800Z" /></clipPath>
                <filter id="c-blur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="7" /></filter>
                <linearGradient id="c-shade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#8a5550" stopOpacity="0.18" />
                  <stop offset="0.35" stopColor="#8a5550" stopOpacity="0" />
                  <stop offset="0.56" stopColor="#8a5550" stopOpacity="0.12" />
                  <stop offset="1" stopColor="#8a5550" stopOpacity="0.05" />
                </linearGradient>
                <linearGradient id="satin-l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f9e3df" /><stop offset="0.5" stopColor="#ebbdb6" /><stop offset="1" stopColor="#cf9890" /></linearGradient>
                <linearGradient id="satin-r" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f9e3df" /><stop offset="0.5" stopColor="#ebbdb6" /><stop offset="1" stopColor="#cf9890" /></linearGradient>
                <linearGradient id="satin-v" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d9a69f" /><stop offset="0.45" stopColor="#f6dcd7" /><stop offset="1" stopColor="#d49f98" /></linearGradient>
                <radialGradient id="satin-k" cx="0.4" cy="0.35" r="0.7"><stop offset="0" stopColor="#fbe7e3" /><stop offset="0.6" stopColor="#e6b3ac" /><stop offset="1" stopColor="#c88e87" /></radialGradient>
                <filter id="bow-shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#6d3f3a" floodOpacity="0.28" /></filter>
              </defs>
              <g clipPath="url(#arch-clip)">
                <CurtainHalf innerRef={r.curtL} />
                <CurtainHalf innerRef={r.curtR} mirror />
              </g>
            </svg>
            <img className="layer" src={arch} alt="" draggable="false" />
            <svg className="layer" viewBox="0 0 1000 1800" preserveAspectRatio="none" aria-hidden="true">
              <Bow refs={r} />
            </svg>
            <div className="gate-text" ref={r.gateText}>
              <p className="caps tiny">We&rsquo;re getting married</p>
              <p className="script gate-name">{groom.firstName}</p>
              <p className="amp-serif gate-amp">&amp;</p>
              <p className="script gate-name">{bride.firstName}</p>
            </div>
          </div>
          <Petals count={10} className="gate-petals" />
        </div>

        {/* Envelope pocket (front) */}
        <div className="pocket" ref={r.pocket}>
          <div className="shadowed"><div className="flap-side left" style={paperBg} /></div>
          <div className="shadowed"><div className="flap-side right" style={paperBg} /></div>
          <div className="shadowed strong"><div className="flap-bottom" style={paperBg} /></div>
          <div className="env-text" ref={r.envText}>
            <p className="caps tiny gold">You are invited</p>
            <p className="script env-script">Requests the pleasure<br />of your company</p>
          </div>
        </div>

        {/* Top flap with 3D rotation */}
        <div className="flap" ref={r.flap}>
          <div className="flap-shadow" ref={r.flapShadow} />
          <div className="flap-face front" style={paperBg}>
            <span className="emboss-names script">{groom.firstName} <span className="amp-serif">&amp;</span> {bride.firstName}</span>
          </div>
          <div className="flap-face back" style={paperBg} />
        </div>

        <button className="seal" ref={r.sealWrap} onClick={openEnvelope} aria-label="Tap the seal to open the invitation">
          <img ref={r.sealL} className="seal-half l" src={seal} alt="" draggable="false" />
          <img ref={r.sealR} className="seal-half r" src={seal} alt="" draggable="false" />
        </button>
      </div>

      <AnimatePresence>
        {phase === 'envelope' && (
          <motion.button key="h1" className="hint" onClick={openEnvelope}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 2.2, duration: 0.8 } }} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
            Tap the seal to open
          </motion.button>
        )}
        {phase === 'gate' && (
          <motion.button key="h2" className="hint on-gate" onClick={untie}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.4, duration: 0.7 } }} exit={{ opacity: 0, transition: { duration: 0.3 } }}>
            Tap the ribbon
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
