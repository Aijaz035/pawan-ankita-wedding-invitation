# Pawan & Ankita · Animated Wedding Invitation

An interactive digital wedding invitation built with React, GSAP, Framer Motion and CSS 3D transforms.
Guests open the link, tap the wax seal, the envelope flap swings open, the card slides out, the satin
ribbon unties, the curtains part, and the invitation pages reveal themselves as they scroll.

## Experience
1. **Envelope** – embossed blush paper, champagne wax seal (P·A monogram), "You are invited".
2. **Ribbon gate** – floral rose arch, satin curtains tied with a bow, "We're getting married".
3. **Invitation card** – names, invitation message, wedding date and venue.
4. **The Groom** – parents, 26 November · Engagement 6:00 PM · Tilak 8:00 PM, Neelkanth Lawn.
5. **The Bride** – parents and residence.
6. **The Wedding Ceremony** – 3 December, Swarnim Lawn and Banquet Hall.
7. **Closing** – a warm message, falling petals, "Open the envelope again".

All details live in **`src/data/wedding.js`** – edit only that file to change any text.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Deploy free on Vercel (Hobby) via GitHub
1. Create a new **public or private** repository on GitHub (e.g. `pawan-ankita-wedding`).
2. Upload this folder's contents (everything except `node_modules`/`dist`) – drag & drop on
   GitHub's "uploading an existing file" page works, or:
   ```bash
   git init && git add . && git commit -m "Wedding invitation"
   git branch -M main
   git remote add origin https://github.com/<your-username>/pawan-ankita-wedding.git
   git push -u origin main
   ```
3. Go to <https://vercel.com/new>, sign in with GitHub (free Hobby plan), **Import** the repository.
   Vercel detects Vite automatically – just press **Deploy**.
4. You get a public link like `https://pawan-ankita-wedding.vercel.app`. Share it on WhatsApp.
   (You can rename the project in Vercel → Settings to get a nicer `*.vercel.app` name.)

### WhatsApp link preview
The preview title, description and image (`public/og-image.jpg`) are wired in `index.html`.
WhatsApp needs an absolute image URL; the build fills it automatically from Vercel's production
domain (`VERCEL_PROJECT_PRODUCTION_URL`). If you add a custom domain later, set an environment
variable `SITE_URL=https://your-domain` in Vercel and redeploy.
Tip: WhatsApp caches previews – send the link once to yourself first to check it.

## Music
`src/assets/canon-in-d.mp3` is an original rendition of Pachelbel's *Canon in D* (public-domain
composition) synthesised from scratch by `scripts/music.py` – no third-party recording or licence
involved. Music starts only after the guest taps the seal; the round button at bottom-left toggles it.
Envelope/ribbon sound effects are synthesised live with the Web Audio API.

## Artwork
All florals, the arch, garden, embossed paper and wax seal are generated procedurally
(`scripts/flora.mjs`, `scripts/render-assets.mjs`) and rendered to optimised WebP files at build time.
The ink sketches (rings, diya, lotus, banquet hall, drapery) are inline SVG drawn on scroll.
To regenerate (needs Playwright + Python Pillow): `node scripts/render-assets.mjs` and `node scripts/og-image.mjs`.
