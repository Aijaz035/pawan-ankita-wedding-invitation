import { useMemo } from 'react';

export function Monogram({ size = 92, className = '' }) {
  return (
    <svg className={`monogram ${className}`} width={size} height={size} viewBox="0 0 120 120" aria-label="P and A monogram">
      <defs>
        <linearGradient id="mg-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d9bf8f" />
          <stop offset="0.5" stopColor="#a8874f" />
          <stop offset="1" stopColor="#d2b47f" />
        </linearGradient>
      </defs>
      <circle className="ink" cx="60" cy="60" r="56" fill="none" stroke="url(#mg-gold)" strokeWidth="0.9" />
      <circle className="ink" cx="60" cy="60" r="52" fill="none" stroke="url(#mg-gold)" strokeWidth="0.5" />
      <g className="mono-letters" fill="currentColor">
        <text x="50" y="72" fontFamily="'Pinyon Script', cursive" fontSize="58" textAnchor="middle">P</text>
        <text x="72" y="80" fontFamily="'Pinyon Script', cursive" fontSize="52" textAnchor="middle">A</text>
      </g>
      <g fill="none" stroke="url(#mg-gold)" strokeWidth="0.8" strokeLinecap="round">
        <path className="ink" d="M40 104 C50 108 70 108 80 104" />
        <path className="ink" d="M46 106 c-4 -5 -10 -5 -12 -3 c4 4 8 4 12 3z M74 106 c4 -5 10 -5 12 -3 c-4 4 -8 4 -12 3z" />
        <circle cx="60" cy="107" r="1.6" fill="#b89766" stroke="none" />
      </g>
    </svg>
  );
}

export function Divider({ className = '' }) {
  return (
    <svg className={`divider ${className}`} viewBox="0 0 240 24" aria-hidden="true">
      <g fill="none" stroke="var(--gold)" strokeWidth="0.8" strokeLinecap="round">
        <path className="ink" d="M8 12 H92" />
        <path className="ink" d="M148 12 H232" />
        <path className="ink" d="M92 12 C100 4 108 4 112 10 C114 14 110 17 107 14" />
        <path className="ink" d="M148 12 C140 4 132 4 128 10 C126 14 130 17 133 14" />
        <path className="ink" d="M120 4 L126 12 L120 20 L114 12 Z" />
      </g>
      <circle cx="120" cy="12" r="1.8" fill="var(--gold)" />
      <circle cx="6" cy="12" r="1.4" fill="var(--gold)" />
      <circle cx="234" cy="12" r="1.4" fill="var(--gold)" />
    </svg>
  );
}

// Lightweight falling petals: pure CSS transform animations.
export function Petals({ count = 14, className = '' }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 37 + 11) % 100,
        delay: -((i * 1.7) % 12),
        dur: 9 + ((i * 2.3) % 7),
        size: 8 + ((i * 5) % 9),
        drift: ((i % 2 ? 1 : -1) * (20 + ((i * 13) % 40))),
        hue: i % 3,
      })),
    [count]
  );
  return (
    <div className={`petals ${className}`} aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className={`petal petal-${p.hue}`}
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 0.78, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, '--drift': `${p.drift}px` }}
        />
      ))}
    </div>
  );
}
