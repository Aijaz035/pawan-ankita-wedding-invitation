// Build-time asset renderer: turns procedural SVG artwork into optimised WebP/JPG.
// Usage: node scripts/render-assets.mjs [name ...]
import { writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require(execSync('npm root -g').toString().trim() + '/playwright'); }
const { chromium } = pw;
import path from 'node:path';
import { cluster, rng, strand, defs, rose, leaf, eucalyptus, babysBreath } from './flora.mjs';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(ROOT, 'src/assets');
const PUB = path.join(ROOT, 'public');
const TMP = process.env.TMPDIR_ASSETS || '/tmp/claude-0/-home-claude/bb534f22-bd2b-54b2-ac30-7d779489b4e9/scratchpad/render';
mkdirSync(OUT, { recursive: true });
mkdirSync(TMP, { recursive: true });
const FONT = (p) => 'file://' + path.join(ROOT, 'node_modules/@fontsource', p);

const fontCss = `
@font-face{font-family:Pinyon;src:url(${FONT('pinyon-script/files/pinyon-script-latin-400-normal.woff2')})}
@font-face{font-family:Cinzel;src:url(${FONT('cinzel/files/cinzel-latin-500-normal.woff2')})}
@font-face{font-family:Cormorant;font-style:italic;src:url(${FONT('cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2')})}
@font-face{font-family:Cormorant;src:url(${FONT('cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2')})}
`;

const clamp = (v) => Math.max(0, Math.min(1, v));
const smooth = (e0, e1, x) => { const t = clamp((x - e0) / (e1 - e0)); return t * t * (3 - 2 * t); };

const jobs = {
  // Top garland with hanging strands (hero + closing)
  canopy() {
    const w = 1000, h = 820, R = rng(11);
    let under = '';
    for (let x = 150; x < 860; x += 26 + R() * 26) {
      const top = 120 + Math.sin(((x - 150) / 710) * Math.PI) * 40;
      under += strand(x, top, 120 + R() * 260 * (0.4 + 0.6 * Math.sin(((x - 150) / 710) * Math.PI)), R, (R() - 0.5) * 2);
    }
    return { w, h, svg: cluster({ w, h, seed: 7, count: 170, sizes: [16, 58], under,
      density: (x, y) => {
        const band = 1 - smooth(110, 230, y - Math.sin((x / w) * Math.PI) * 50);
        const side = (1 - smooth(70, 200, Math.min(x, w - x))) * (1 - smooth(560, 800, y));
        return clamp(Math.max(band, side) * 0.95);
      } }) };
  },
  // Floral arch for the ribbon gate
  arch() {
    const w = 1000, h = 1800, R = rng(5);
    const cx = 500, cy = 760, r = 330;
    const archDist = (x, y) => {
      if (y < cy) return Math.abs(Math.hypot(x - cx, y - cy) - r);
      return Math.min(Math.abs(x - (cx - r)), Math.abs(x - (cx + r)));
    };
    const pillars = `<defs><linearGradient id="stone" x1="0" x2="1"><stop offset="0" stop-color="#e9ddd6"/><stop offset="0.45" stop-color="#fffaf6"/><stop offset="1" stop-color="#d6c4bc"/></linearGradient></defs>
      <path d="M${cx - r - 34} 1800 V${cy} A${r + 34} ${r + 34} 0 0 1 ${cx + r + 34} ${cy} V1800 H${cx + r - 10} V${cy} A${r - 10} ${r - 10} 0 0 0 ${cx - r + 10} ${cy} V1800Z" fill="url(#stone)" opacity="0.95"/>
      <path d="M${cx - r - 34} 1800 V${cy} A${r + 34} ${r + 34} 0 0 1 ${cx + r + 34} ${cy} V1800" fill="none" stroke="#c9b2a9" stroke-width="2" opacity="0.6"/>`;
    let hang = '';
    for (let a = 200; a <= 340; a += 9) {
      const x = cx + Math.cos((a * Math.PI) / 180) * (r - 30), y = cy + Math.sin((a * Math.PI) / 180) * (r - 30);
      hang += strand(x, y, 60 + R() * 150, R, 0);
    }
    return { w, h, svg: cluster({ w, h, seed: 21, count: 230, sizes: [16, 56], under: pillars + hang,
      density: (x, y) => {
        const d = archDist(x, y);
        let base = 1 - smooth(20, 95, d);
        if (y > cy) base *= 0.25 + 0.75 * (smooth(cy + 250, cy, y) + smooth(1450, 1750, y));
        const top = 1 - smooth(60, 260, y);
        return clamp(Math.max(base, top * 0.9));
      } }) };
  },
  bed() {
    const w = 1000, h = 460;
    return { w, h, svg: cluster({ w, h, seed: 31, count: 130, sizes: [16, 54],
      density: (x, y) => {
        const mound = h - (180 + Math.cos(((x - w / 2) / w) * Math.PI * 1.6) * 120);
        return clamp(smooth(mound - 40, mound + 70, y) * (0.6 + 0.4 * (1 - Math.cos(((x - w / 2) / w) * 3) ** 2)) + smooth(mound - 40, mound + 70, y) * 0.4);
      } }) };
  },
  corner() {
    const w = 640, h = 640;
    return { w, h, svg: cluster({ w, h, seed: 44, count: 60, sizes: [16, 60],
      density: (x, y) => clamp((1 - smooth(120, 330, Math.hypot(x * 1.15, y - 300))) * smooth(40, 120, y) * (1 - smooth(560, 620, y))) } ) };
  },
  spray() {
    const w = 900, h = 300;
    return { w, h, svg: cluster({ w, h, seed: 58, count: 70, sizes: [14, 50], hydra: 0.1,
      density: (x, y) => clamp(1 - smooth(0.55, 1, Math.hypot((x - w / 2) / (w * 0.46), (y - h / 2) / (h * 0.36)))) }) };
  },
  _side() {
    const w = 360, h = 1400;
    return { w, h, svg: cluster({ w, h, seed: 63, count: 90, sizes: [16, 52],
      density: (x, y) => clamp((1 - smooth(60, 230, x + Math.sin(y / 140) * 30)) * (0.35 + 0.65 * (smooth(0, 200, y) * (1 - smooth(1200, 1400, y))))) }) };
  },
  gatebg() {
    const w = 1000, h = 1800, R = rng(77);
    let clouds = '';
    for (let i = 0; i < 26; i++) {
      clouds += `<ellipse cx="${R() * w}" cy="${120 + R() * 900}" rx="${80 + R() * 200}" ry="${30 + R() * 60}" fill="#fff" opacity="${0.18 + R() * 0.3}" filter="url(#cl)"/>`;
    }
    const cypress = (x, base, hh, ww, tone) => `<path d="M${x - ww / 2} ${base} C${x - ww * 0.62} ${base - hh * 0.45} ${x - ww * 0.2} ${base - hh * 0.92} ${x} ${base - hh} C${x + ww * 0.2} ${base - hh * 0.92} ${x + ww * 0.62} ${base - hh * 0.45} ${x + ww / 2} ${base}Z" fill="url(#cyp${tone})" filter="url(#foliage)"/>`;
    let trees = '';
    const spots = [[60, 520, 80], [150, 720, 92], [235, 610, 78], [330, 520, 66], [400, 380, 50], [600, 400, 50], [670, 540, 66], [765, 640, 78], [850, 740, 92], [945, 540, 80]];
    for (const [x, hh, ww] of spots) trees += cypress(x + (R() - 0.5) * 20, 1270, hh, ww, R() < 0.5 ? 1 : 2);
    let petals = '';
    for (let i = 0; i < 160; i++) {
      const t = R(); const y = 1260 + t * t * 540; const half = 30 + (y - 1260) * 0.45;
      const x = 500 + (R() - 0.5) * 2 * half;
      petals += `<ellipse cx="${x}" cy="${y}" rx="${2 + t * 6}" ry="${1.2 + t * 3.5}" transform="rotate(${R() * 180} ${x} ${y})" fill="${R() < 0.5 ? '#f2c9c3' : '#fff6f2'}" opacity="0.9"/>`;
    }
    let edge = '';
    for (let i = 0; i < 70; i++) {
      const t = i / 70, y = 1265 + t * t * 560, half = 34 + (y - 1260) * 0.47;
      for (const s of [-1, 1]) edge += `<circle cx="${500 + s * half}" cy="${y}" r="${2 + t * 9}" fill="${R() < 0.3 ? '#f4d6d1' : '#fffaf7'}" opacity="0.8" filter="url(#sf)"/>`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#c9bfd9"/><stop offset="0.3" stop-color="#ddcde0"/><stop offset="0.55" stop-color="#f0d9dc"/><stop offset="0.7" stop-color="#f8e8e1"/></linearGradient>
        <linearGradient id="lawn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d6d2c0"/><stop offset="1" stop-color="#bfc0a8"/></linearGradient>
        <linearGradient id="cyp1" x1="0" x2="1"><stop offset="0" stop-color="#6f7a68"/><stop offset="0.5" stop-color="#8e9884"/><stop offset="1" stop-color="#66705f"/></linearGradient>
        <linearGradient id="cyp2" x1="0" x2="1"><stop offset="0" stop-color="#7d8775"/><stop offset="0.45" stop-color="#a0a894"/><stop offset="1" stop-color="#737d6b"/></linearGradient>
        <linearGradient id="aisle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3e6e0"/><stop offset="1" stop-color="#fbf4f0"/></linearGradient>
        <filter id="cl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="28"/></filter>
        <filter id="sf"><feGaussianBlur stdDeviation="1.4"/></filter>
        <filter id="haze"><feGaussianBlur stdDeviation="10"/></filter>
        <filter id="foliage" x="-30%" y="-10%" width="160%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.06 0.03" numOctaves="3" seed="4" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="16" result="d"/>
          <feTurbulence type="fractalNoise" baseFrequency="0.25" numOctaves="2" seed="9" result="n2"/>
          <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0.85  0 0 0 0 0.9  0 0 0 0 0.8  0 0 0 0.9 -0.35" result="spk"/>
          <feComposite in="spk" in2="d" operator="in" result="spk2"/>
          <feMerge><feMergeNode in="d"/><feMergeNode in="spk2"/></feMerge>
          <feGaussianBlur stdDeviation="0.6"/>
        </filter>
      </defs>
      <rect width="${w}" height="${h}" fill="url(#sky)"/>
      ${clouds}
      <path d="M0 1220 Q200 1150 420 1200 T1000 1190 V1300 H0Z" fill="#d7c8cc" opacity="0.8" filter="url(#haze)"/>
      <rect y="1250" width="${w}" height="${h - 1250}" fill="url(#lawn)"/>
      <rect y="1240" width="${w}" height="40" fill="#e8dcd8" opacity="0.6" filter="url(#haze)"/>
      ${trees}
      <rect y="500" width="${w}" height="780" fill="#f3dfe0" opacity="0.28"/>
      <path d="M470 1262 L530 1262 L800 1800 L200 1800Z" fill="url(#aisle)"/>
      ${petals}${edge}
    </svg>`;
    return { w, h, svg, opaque: true };
  },
  paper() {
    const w = 900, h = 1800, R = rng(99);
    let g = '';
    const sprig = (x, y, s, a) => {
      let o = `<g transform="translate(${x} ${y}) rotate(${a}) scale(${s})">`;
      o += `<path d="M0 0 C20 40 -10 90 10 150" fill="none" stroke-width="2.4"/>`;
      o += `<path d="M6 70 C30 60 46 70 56 52 C36 46 20 56 6 70Z" stroke-width="1.6"/>`;
      o += `<path d="M2 110 C-24 100 -40 112 -52 94 C-30 86 -14 98 2 110Z" stroke-width="1.6"/>`;
      o += `<circle cx="0" cy="-8" r="26" stroke-width="2"/>`;
      o += `<path d="M-14 -12 A14 14 0 0 1 12 -18 M-8 -2 A10 10 0 0 0 10 -6 M-20 2 A20 20 0 0 0 16 6" fill="none" stroke-width="1.6"/>`;
      o += `<path d="M-26 -8 C-34 -30 -12 -40 0 -34 C14 -42 34 -28 26 -8" fill="none" stroke-width="1.6"/>`;
      o += `<circle cx="34" cy="20" r="9" stroke-width="1.4"/><circle cx="-30" cy="40" r="6" stroke-width="1.2"/>`;
      return o + '</g>';
    };
    for (let y = -40; y < h + 80; y += 150) {
      for (let x = (y / 150) % 2 ? 60 : 0; x < w + 80; x += 170) {
        g += sprig(x + (R() - 0.5) * 50, y + (R() - 0.5) * 40, 0.8 + R() * 0.45, R() * 360);
      }
    }
    const base = '#f2d5cd';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs>
        <g id="m" stroke-linecap="round" stroke-linejoin="round">${g}</g>
        <filter id="b1"><feGaussianBlur stdDeviation="1.1"/></filter>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="2"/>
          <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.28  0 0 0 0.14 0"/>
        </filter>
        <filter id="fiber" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.18" numOctaves="2" seed="8"/>
          <feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.22 -0.05"/>
        </filter>
        <radialGradient id="vig" cx="0.5" cy="0.45" r="0.75"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#7a4a42" stop-opacity="0.16"/></radialGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="${base}"/>
      <use href="#m" transform="translate(2.2 2.4)" fill="#9c6c64" stroke="#9c6c64" opacity="0.22" filter="url(#b1)"/>
      <use href="#m" transform="translate(-1.6 -1.6)" fill="#fff6f2" stroke="#fff6f2" opacity="0.85" filter="url(#b1)"/>
      <use href="#m" fill="${base}" stroke="${base}"/>
      <rect width="${w}" height="${h}" filter="url(#fiber)"/>
      <rect width="${w}" height="${h}" filter="url(#grain)"/>
      <rect width="${w}" height="${h}" fill="url(#vig)"/>
    </svg>`;
    return { w, h, svg, opaque: true, q: 80 };
  },
  seal() {
    const w = 560, h = 560;
    const mono = (dx, dy, fill, op, extra = '') => `<g transform="translate(${dx} ${dy})" fill="${fill}" opacity="${op}" ${extra}>
        <text x="236" y="318" font-family="Pinyon" font-size="196" text-anchor="middle">P</text>
        <text x="318" y="338" font-family="Pinyon" font-size="176" text-anchor="middle">A</text></g>`;
    let dots = '';
    for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; dots += `<circle cx="${280 + Math.cos(a) * 158}" cy="${280 + Math.sin(a) * 158}" r="2.4"/>`; }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <defs>
        <radialGradient id="wax" cx="0.42" cy="0.38" r="0.7"><stop offset="0" stop-color="#f6ecdc"/><stop offset="0.55" stop-color="#e3cfb1"/><stop offset="0.85" stop-color="#c8ad89"/><stop offset="1" stop-color="#a88c6a"/></radialGradient>
        <radialGradient id="disc" cx="0.6" cy="0.62" r="0.7"><stop offset="0" stop-color="#ecdcc3"/><stop offset="0.7" stop-color="#dcc6a6"/><stop offset="1" stop-color="#c7ad8a"/></radialGradient>
        <linearGradient id="rim" x1="0.15" y1="0.1" x2="0.85" y2="0.9"><stop offset="0" stop-color="#fff8ec"/><stop offset="0.5" stop-color="#d8c2a1"/><stop offset="1" stop-color="#9d8160"/></linearGradient>
        <linearGradient id="rimIn" x1="0.85" y1="0.9" x2="0.15" y2="0.1"><stop offset="0" stop-color="#fff8ec"/><stop offset="0.5" stop-color="#d8c2a1"/><stop offset="1" stop-color="#9d8160"/></linearGradient>
        <filter id="blob" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="2" seed="12" result="n"/>
          <feDisplacementMap in="SourceGraphic" in2="n" scale="34"/></filter>
        <filter id="sh" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
        <filter id="b"><feGaussianBlur stdDeviation="1.4"/></filter>
        <filter id="gl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
        <filter id="tex"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="5"/><feColorMatrix type="matrix" values="0 0 0 0 0.5 0 0 0 0 0.4 0 0 0 0 0.3 0 0 0 0.12 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
        <clipPath id="c"><circle cx="280" cy="280" r="200"/></clipPath>
      </defs>
      <g filter="url(#blob)">
        <circle cx="290" cy="296" r="236" fill="#6d4f3a" opacity="0.35" filter="url(#sh)"/>
        <circle cx="280" cy="280" r="232" fill="url(#wax)"/>
        <circle cx="280" cy="280" r="232" fill="#000" filter="url(#tex)"/>
      </g>
      <circle cx="280" cy="280" r="198" fill="url(#rimIn)" />
      <circle cx="280" cy="280" r="186" fill="url(#disc)"/>
      <circle cx="280" cy="280" r="198" fill="none" stroke="url(#rim)" stroke-width="10"/>
      <g fill="#b39773" opacity="0.6">${dots}</g>
      <g clip-path="url(#c)">
        ${mono(3, 4, '#8b6f50', 0.55, 'filter="url(#b)"')}
        ${mono(-2.5, -2.5, '#fffaf0', 0.9, 'filter="url(#b)"')}
        ${mono(0, 0, '#d9c3a2', 1)}
      </g>
      <ellipse cx="200" cy="170" rx="90" ry="46" fill="#fff" opacity="0.32" filter="url(#gl)" transform="rotate(-30 200 170)"/>
    </svg>`;
    return { w, h, svg };
  },
};

async function render(page, name, { w, h, svg, opaque, q = 82 }) {
  const htmlPath = path.join(TMP, name + '.html');
  writeFileSync(htmlPath, `<!doctype html><html><head><style>${fontCss}html,body{margin:0;background:transparent}</style></head><body>${svg}</body></html>`);
  writeFileSync(path.join(TMP, name + '.svg'), svg);
  await page.setViewportSize({ width: w, height: h });
  await page.goto('file://' + htmlPath);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  const png = path.join(TMP, name + '.png');
  await page.screenshot({ path: png, omitBackground: !opaque, clip: { x: 0, y: 0, width: w, height: h } });
  const out = path.join(OUT, name + '.webp');
  execFileSync('python3', ['-c', `
from PIL import Image; im=Image.open('${png}'); im.save('${out}', 'WEBP', quality=${q}, method=6)`]);
  console.log('rendered', name);
}

const want = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, fn] of Object.entries(jobs)) {
  if (want.length && !want.includes(name)) continue;
  await render(page, name, fn());
}
await browser.close();
