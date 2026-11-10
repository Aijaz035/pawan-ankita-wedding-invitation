// Renders public/og-image.jpg (WhatsApp/social preview) and favicons.
import { writeFileSync } from 'node:fs';
import { execFileSync, execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
const require = createRequire(import.meta.url);
let pw; try { pw = require('playwright'); } catch { pw = require(execSync('npm root -g').toString().trim() + '/playwright'); }
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const A = (f) => 'file://' + path.join(ROOT, 'src/assets', f);
const F = (p) => 'file://' + path.join(ROOT, 'node_modules/@fontsource', p);
const TMP = '/tmp/claude-0/-home-claude/bb534f22-bd2b-54b2-ac30-7d779489b4e9/scratchpad/render';
const html = `<!doctype html><html><head><style>
@font-face{font-family:Pinyon;src:url(${F('pinyon-script/files/pinyon-script-latin-400-normal.woff2')})}
@font-face{font-family:Cinzel;src:url(${F('cinzel/files/cinzel-latin-500-normal.woff2')})}
@font-face{font-family:Corm;font-style:italic;src:url(${F('cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2')})}
body{margin:0;width:1200px;height:630px;overflow:hidden;position:relative;background:#f2d5cd url(${A('paper.webp')}) center/700px auto;font-family:Cinzel;color:#6b4a46}
.c{position:absolute;width:380px}.tl{top:-40px;left:-40px}.br{bottom:-40px;right:-40px;transform:rotate(180deg)}
.tr{top:-40px;right:-40px;transform:scaleX(-1);width:300px}.bl{bottom:-40px;left:-40px;transform:scaleY(-1);width:300px}
.mid{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:56px}
.seal{width:250px;filter:drop-shadow(0 10px 14px rgba(90,60,40,.35))}
.t{text-align:center}.k{font-size:20px;letter-spacing:.42em;color:#9a7746}
.n{font-family:Pinyon;font-size:104px;line-height:1.1;margin:8px 0 4px}
.d{font-size:22px;letter-spacing:.24em}.v{font-family:Corm;font-style:italic;font-size:30px;margin-top:8px;color:#8b6d67}
</style></head><body>
<img class="c tl" src="${A('corner.webp')}"><img class="c br" src="${A('corner.webp')}">
<div class="mid"><img class="seal" src="${A('seal.webp')}"><div class="t">
<div class="k">WEDDING INVITATION</div><div class="n">Pawan &amp; Ankita</div>
<div class="d">3 DECEMBER</div><div class="v">Swarnim Lawn and Banquet Hall, Hasanganj, Unnao</div></div></div>
</body></html>`;
writeFileSync(path.join(TMP, 'og.html'), html);
const b = await pw.chromium.launch(); const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto('file://' + path.join(TMP, 'og.html')); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
await p.screenshot({ path: path.join(ROOT, 'public/og-image.jpg'), type: 'jpeg', quality: 86 });
await b.close();
const seal = path.join(TMP, 'seal.png');
execFileSync('python3', ['-c', `from PIL import Image
im=Image.open('${seal}').convert('RGBA'); bb=im.getbbox(); im=im.crop(bb)
im.resize((64,64),Image.LANCZOS).save('${ROOT}/public/favicon.png')
bg=Image.new('RGBA',(180,180),(242,213,205,255)); s=im.resize((150,150),Image.LANCZOS); bg.alpha_composite(s,(15,15)); bg.convert('RGB').save('${ROOT}/public/apple-touch-icon.png')`]);
console.log('og ok');
