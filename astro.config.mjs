import { defineConfig } from 'astro/config';

/*
 * Recipes are parsed to src/generated/recipes.json before the build (see package.json),
 * so the WASM parser never has to run inside Vite.
 *
 * The site is built for GitHub Pages at https://johnhkchen.github.io/tabular-recipes/,
 * which means every internal link has to carry that /tabular-recipes/ prefix — see
 * src/lib/url.ts. To move it to a custom domain instead, set SITE_URL and SITE_BASE=/
 * and put the domain in public/CNAME; nothing else changes.
 */
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://johnhkchen.github.io',
  base: process.env.SITE_BASE ?? '/tabular-recipes',
  trailingSlash: 'always',
  srcDir: './src',
  build: { format: 'directory' },
});
