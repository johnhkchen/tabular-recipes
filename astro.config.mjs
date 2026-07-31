import { defineConfig } from 'astro/config';

/*
 * Recipes are parsed to src/generated/recipes.json before the build (see package.json),
 * so the WASM parser never has to run inside Vite.
 *
 * The site lives at https://recipes.b28.dev/ — a custom domain, so it sits at the root and
 * the base is just "/". The domain itself is in public/CNAME, which is what tells GitHub
 * Pages to serve it there. Every internal link still goes through src/lib/url.ts, so moving
 * it back under a path only means setting SITE_URL and SITE_BASE.
 */
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://recipes.b28.dev',
  base: process.env.SITE_BASE ?? '/',
  trailingSlash: 'always',
  srcDir: './src',
  build: { format: 'directory' },
});
