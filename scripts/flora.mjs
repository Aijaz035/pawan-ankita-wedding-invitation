// Procedural botanical art generator. Produces SVG strings that are rendered
// to transparent WebP images by scripts/render-assets.mjs (build-time only).

export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const PALETTES = {
  ivory: { edge: '#fffbf7', mid: '#f7ebe5', base: '#e2c6bd', deep: '#b08e86', core: '#8e6a64' },
  blush: { edge: '#fdeeea', mid: '#f3d1cb', base: '#dca9a2', deep: '#b07a74', core: '#8a5853' },
  champ: { edge: '#fffaf0', mid: '#f5e6d4', base: '#dcc0a2', deep: '#ad8e70', core: '#86684f' },
  dusty: { edge: '#f9e4e1', mid: '#ebc0bb', base: '#cf948e', deep: '#a26762', core: '#7a4642' },
};

export function defs() {
  let s = '<defs>';
  for (const [k, p] of Object.entries(PALETTES)) {
    s += `<radialGradient id="po-${k}" cx="0.5" cy="1" r="1.05">
      <stop offset="0" stop-color="${p.deep}"/><stop offset="0.35" stop-color="${p.base}"/>
      <stop offset="0.72" stop-color="${p.mid}"/><stop offset="1" stop-color="${p.edge}"/></radialGradient>
    <radialGradient id="pm-${k}" cx="0.5" cy="1" r="1">
      <stop offset="0" stop-color="${p.deep}"/><stop offset="0.5" stop-color="${p.base}"/>
      <stop offset="1" stop-color="${p.edge}"/></radialGradient>
    <radialGradient id="pc-${k}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${p.core}"/><stop offset="0.45" stop-color="${p.deep}"/>
      <stop offset="0.8" stop-color="${p.base}"/><stop offset="1" stop-color="${p.mid}"/></radialGradient>`;
  }
  s += `<linearGradient id="leaf" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#b9c2ad"/><stop offset="0.6" stop-color="#93a088"/><stop offset="1" stop-color="#6f7d66"/></linearGradient>
    <linearGradient id="leaf2" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#cfd3c3"/><stop offset="1" stop-color="#9aa592"/></linearGradient>
    <radialGradient id="pearl" cx="0.35" cy="0.3" r="0.7">
      <stop offset="0" stop-color="#ffffff"/><stop offset="0.6" stop-color="#f4ebe6"/><stop offset="1" stop-color="#cdb7ae"/></radialGradient>
    <filter id="organic" x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.5"/>
      <feGaussianBlur stdDeviation="0.35"/>
    </filter>
    <filter id="soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
    <filter id="soft2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.5"/></filter>
  </defs>`;
  return s;
}

const f = (n) => Math.round(n * 100) / 100;

function petalPath(L, w, cup = 0.2) {
  return `M0 0 C${f(-w * 0.95)} ${f(-L * cup)} ${f(-w * 0.8)} ${f(-L * 1.02)} 0 ${f(-L * 0.96)} C${f(w * 0.8)} ${f(-L * 1.02)} ${f(w * 0.95)} ${f(-L * cup)} 0 0Z`;
}

export function rose(cx, cy, r, pal, R, opts = {}) {
  const rot = R() * 360;
  const p = PALETTES[pal];
  let s = `<g transform="translate(${f(cx)} ${f(cy)})" filter="url(#organic)">`;
  // drop shadow
  s += `<ellipse cx="${f(r * 0.1)}" cy="${f(r * 0.16)}" rx="${f(r * 1.05)}" ry="${f(r * 1.0)}" fill="#6b4743" opacity="${opts.shadow ?? 0.22}" filter="url(#soft)"/>`;
  // outer petals
  const n1 = 6;
  for (let i = 0; i < n1; i++) {
    const a = rot + (i * 360) / n1 + (R() - 0.5) * 18;
    const L = r * (0.98 + R() * 0.08), w = r * (0.72 + R() * 0.12);
    s += `<g transform="rotate(${f(a)})"><path d="${petalPath(L, w)}" fill="url(#po-${pal})" stroke="${p.deep}" stroke-opacity="0.28" stroke-width="${f(r * 0.012)}"/>`;
    s += `<path d="M${f(-w * 0.55)} ${f(-L * 0.86)} Q0 ${f(-L * 1.0)} ${f(w * 0.55)} ${f(-L * 0.86)}" fill="none" stroke="#fff" stroke-opacity="0.55" stroke-width="${f(r * 0.03)}" stroke-linecap="round"/></g>`;
  }
  // middle petals
  const n2 = 5;
  for (let i = 0; i < n2; i++) {
    const a = rot + 30 + (i * 360) / n2 + (R() - 0.5) * 20;
    const L = r * (0.74 + R() * 0.06), w = r * (0.58 + R() * 0.08);
    s += `<g transform="rotate(${f(a)})"><path d="${petalPath(L, w, 0.3)}" fill="url(#pm-${pal})" stroke="${p.deep}" stroke-opacity="0.3" stroke-width="${f(r * 0.012)}"/>`;
    s += `<path d="M${f(-w * 0.5)} ${f(-L * 0.84)} Q0 ${f(-L * 0.99)} ${f(w * 0.5)} ${f(-L * 0.84)}" fill="none" stroke="#fff" stroke-opacity="0.6" stroke-width="${f(r * 0.028)}" stroke-linecap="round"/></g>`;
  }
  // inner cup
  s += `<circle r="${f(r * 0.5)}" fill="url(#pc-${pal})"/>`;
  let a0 = rot;
  for (let k = 0; k < 7; k++) {
    const rr = r * (0.48 - k * 0.058);
    if (rr <= r * 0.05) break;
    const span = 150 + R() * 70;
    const a1 = (a0 * Math.PI) / 180, a2 = ((a0 + span) * Math.PI) / 180;
    const x1 = Math.cos(a1) * rr, y1 = Math.sin(a1) * rr, x2 = Math.cos(a2) * rr, y2 = Math.sin(a2) * rr;
    const ri = rr * 0.72;
    const xm = Math.cos((a1 + a2) / 2) * ri * 0.6, ym = Math.sin((a1 + a2) / 2) * ri * 0.6;
    // crescent petal lip
    s += `<path d="M${f(x1)} ${f(y1)} A${f(rr)} ${f(rr)} 0 0 1 ${f(x2)} ${f(y2)} Q${f(xm)} ${f(ym)} ${f(x1)} ${f(y1)}Z" fill="${k % 2 ? p.mid : p.base}" opacity="0.92"/>`;
    s += `<path d="M${f(x1)} ${f(y1)} A${f(rr)} ${f(rr)} 0 0 1 ${f(x2)} ${f(y2)}" fill="none" stroke="${p.edge}" stroke-width="${f(r * 0.035)}" stroke-linecap="round" opacity="0.95"/>`;
    s += `<path d="M${f(x1 * 0.97)} ${f(y1 * 0.97 + r * 0.02)} A${f(rr * 0.97)} ${f(rr * 0.97)} 0 0 1 ${f(x2 * 0.97)} ${f(y2 * 0.97 + r * 0.02)}" fill="none" stroke="${p.deep}" stroke-width="${f(r * 0.015)}" opacity="0.45"/>`;
    a0 += 115 + R() * 40;
  }
  s += `<circle r="${f(r * 0.07)}" fill="${p.core}" opacity="0.8" filter="url(#soft2)"/>`;
  s += '</g>';
  return s;
}

export function bud(cx, cy, r, pal, R) {
  const p = PALETTES[pal];
  const a = R() * 360;
  return `<g transform="translate(${f(cx)} ${f(cy)}) rotate(${f(a)})" filter="url(#organic)">
    <ellipse cx="${f(r * 0.08)}" cy="${f(r * 0.12)}" rx="${f(r)}" ry="${f(r * 0.9)}" fill="#6b4743" opacity="0.18" filter="url(#soft2)"/>
    <ellipse rx="${f(r)}" ry="${f(r * 0.85)}" fill="url(#pm-${pal})"/>
    <path d="M${f(-r * 0.7)} ${f(-r * 0.2)} Q0 ${f(-r * 0.9)} ${f(r * 0.7)} ${f(-r * 0.2)}" stroke="${p.edge}" stroke-width="${f(r * 0.12)}" fill="none" stroke-linecap="round"/>
    <path d="M${f(-r * 0.4)} ${f(r * 0.15)} Q0 ${f(-r * 0.35)} ${f(r * 0.45)} ${f(r * 0.1)}" stroke="${p.deep}" stroke-width="${f(r * 0.07)}" fill="none" opacity="0.6"/>
  </g>`;
}

export function hydrangea(cx, cy, r, R, tint = '#efe6ee') {
  let s = `<g filter="url(#organic)"><circle cx="${f(cx + r * 0.08)}" cy="${f(cy + r * 0.12)}" r="${f(r)}" fill="#6b4743" opacity="0.16" filter="url(#soft)"/>`;
  s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.92)}" fill="#e3d4d6"/>`;
  const n = Math.round(14 + r / 3);
  const fl = [];
  for (let i = 0; i < n; i++) {
    const t = R() * Math.PI * 2, d = Math.sqrt(R()) * r * 0.82;
    fl.push([cx + Math.cos(t) * d, cy + Math.sin(t) * d, r * (0.2 + R() * 0.07), R() * 90]);
  }
  fl.sort((a, b) => a[1] - b[1]);
  for (const [x, y, fr, a] of fl) {
    s += `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(a)})">`;
    for (let k = 0; k < 4; k++) s += `<ellipse transform="rotate(${k * 90})" cy="${f(-fr * 0.55)}" rx="${f(fr * 0.42)}" ry="${f(fr * 0.55)}" fill="${tint}" stroke="#c9b3b8" stroke-width="0.6" stroke-opacity="0.7"/>`;
    s += `<circle r="${f(fr * 0.14)}" fill="#b89aa2"/></g>`;
  }
  return s + '</g>';
}

export function leaf(x, y, len, ang, R, light = false) {
  const w = len * (0.28 + R() * 0.08);
  return `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})" filter="url(#organic)">
    <path d="M0 0 C${f(w)} ${f(-len * 0.25)} ${f(w * 0.9)} ${f(-len * 0.75)} 0 ${f(-len)} C${f(-w * 0.9)} ${f(-len * 0.75)} ${f(-w)} ${f(-len * 0.25)} 0 0Z" fill="url(#${light ? 'leaf2' : 'leaf'})" opacity="0.92"/>
    <path d="M0 0 Q${f(w * 0.08)} ${f(-len * 0.5)} 0 ${f(-len * 0.95)}" stroke="#e6e9dd" stroke-width="${f(len * 0.02)}" fill="none" opacity="0.7"/>
  </g>`;
}

export function eucalyptus(x, y, len, ang, R) {
  let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(ang)})">`;
  s += `<path d="M0 0 Q${f(len * 0.08)} ${f(-len * 0.5)} 0 ${f(-len)}" stroke="#8d9883" stroke-width="1.6" fill="none"/>`;
  const n = 6;
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 1), rr = len * (0.09 - t * 0.04);
    const side = i % 2 ? 1 : -1;
    s += `<ellipse cx="${f(side * rr * 1.1)}" cy="${f(-len * t)}" rx="${f(rr)}" ry="${f(rr * 0.85)}" fill="#aab4a2" stroke="#87937d" stroke-width="0.6" opacity="0.92"/>`;
  }
  return s + '</g>';
}

export function babysBreath(x, y, r, R) {
  let s = '<g>';
  for (let i = 0; i < 18; i++) {
    const t = R() * Math.PI * 2, d = Math.sqrt(R()) * r;
    const px = x + Math.cos(t) * d, py = y + Math.sin(t) * d;
    s += `<line x1="${f(x)}" y1="${f(y + r * 0.6)}" x2="${f(px)}" y2="${f(py)}" stroke="#a8ae9c" stroke-width="0.6" opacity="0.5"/>`;
    s += `<circle cx="${f(px)}" cy="${f(py)}" r="${f(1.6 + R() * 2.2)}" fill="url(#pearl)"/>`;
  }
  return s + '</g>';
}

export function strand(x, y, len, R, tilt = 0) {
  let s = `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(tilt)})">`;
  s += `<line x1="0" y1="0" x2="0" y2="${f(len)}" stroke="#d9c6c0" stroke-width="0.9" opacity="0.8"/>`;
  let yy = 10 + R() * 14;
  while (yy < len) {
    const big = R() < 0.3;
    if (big) {
      s += `<g transform="translate(0 ${f(yy)})">`;
      for (let k = 0; k < 5; k++) s += `<ellipse transform="rotate(${k * 72})" cy="-3.6" rx="2.6" ry="3.6" fill="#fffaf6" stroke="#d8c0bb" stroke-width="0.5"/>`;
      s += `<circle r="1.3" fill="#d6b4ad"/></g>`;
    } else {
      s += `<circle cy="${f(yy)}" r="${f(1.8 + R() * 1.4)}" fill="url(#pearl)"/>`;
    }
    yy += 9 + R() * 14;
  }
  // crystal drop
  s += `<path d="M0 ${f(len)} l3.2 6 l-3.2 9 l-3.2 -9z" fill="#fff" stroke="#cdb9b4" stroke-width="0.6" opacity="0.95"/>`;
  return s + '</g>';
}

// Places flowers inside a region defined by a density function d(x,y) in [0,1].
export function cluster({ w, h, seed, density, count = 120, sizes = [18, 46], pals = ['ivory', 'ivory', 'blush', 'champ'], leaves = true, hydra = 0.18, extra = '', under = '' }) {
  const R = rng(seed);
  const items = [];
  let tries = 0;
  while (items.length < count && tries < count * 60) {
    tries++;
    const x = R() * w, y = R() * h;
    const d = density(x, y);
    if (R() > d) continue;
    const size = sizes[0] + (sizes[1] - sizes[0]) * Math.pow(R(), 1.4) * (0.55 + d * 0.45);
    // avoid heavy overlap
    if (items.some((o) => Math.hypot(o.x - x, o.y - y) < (o.r + size) * 0.5)) continue;
    const kindR = R();
    const kind = kindR < hydra ? 'hyd' : kindR < hydra + 0.12 ? 'bud' : 'rose';
    items.push({ x, y, r: size, kind, pal: pals[Math.floor(R() * pals.length)] });
  }
  let back = '', front = '';
  if (leaves) {
    for (const o of items) {
      if (R() < 0.5) {
        const n = 1 + Math.floor(R() * 2);
        for (let k = 0; k < n; k++) {
          const a = R() * 360;
          const lx = o.x + Math.cos((a - 90) * Math.PI / 180) * o.r * 0.6;
          const ly = o.y + Math.sin((a - 90) * Math.PI / 180) * o.r * 0.6;
          back += R() < 0.35 ? eucalyptus(lx, ly, o.r * 2.2, a, R) : leaf(lx, ly, o.r * (1.1 + R() * 0.6), a, R, R() < 0.4);
        }
      }
      if (R() < 0.25) back += babysBreath(o.x + (R() - 0.5) * o.r * 2.4, o.y + (R() - 0.5) * o.r * 2.4, o.r * 0.8, R);
    }
  }
  items.sort((a, b) => a.r - b.r);
  for (const o of items) {
    if (o.kind === 'hyd') front += hydrangea(o.x, o.y, o.r * 0.95, R);
    else if (o.kind === 'bud') front += bud(o.x, o.y, o.r * 0.45, o.pal, R);
    else front += rose(o.x, o.y, o.r, o.pal, R);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs()}${under}${back}${front}${extra}</svg>`;
}
