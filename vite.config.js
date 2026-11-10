import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Absolute site URL for link previews (WhatsApp needs absolute og:image URLs).
// On Vercel this is filled automatically from the production domain.
const siteUrl = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) ||
  ''
).replace(/\/$/, '');

const single = process.env.SINGLE_FILE === '1';

export default defineConfig({
  plugins: [
    react(),
    { name: 'site-url', transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', siteUrl) },
    ...(single ? [viteSingleFile()] : []),
  ],
  build: {
    outDir: single ? 'dist-single' : 'dist',
    assetsInlineLimit: single ? 100000000 : 4096,
    chunkSizeWarningLimit: 900,
  },
});
