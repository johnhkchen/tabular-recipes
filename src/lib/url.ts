/*
 * Every internal link goes through here.
 *
 * On GitHub Pages the site lives under /tabular-recipes/, so a bare href="/espresso-brownies/"
 * would leave the site. Astro puts the configured base in import.meta.env.BASE_URL, and this
 * joins it to a path without doubling or dropping the slash between them.
 */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const rest = path.replace(/^\/+/, '');
  return rest ? `${base}/${rest}` : `${base}/`;
}
