/*
 * Every internal link goes through here.
 *
 * The site sits at the root of recipes.b28.dev today, so the base is "/" and this mostly
 * passes paths through. It still goes through here because a base is a deploy-time setting:
 * served under a path instead, a bare href="/espresso-brownies/" would leave the site.
 * Astro puts the configured base in import.meta.env.BASE_URL, and this joins it to a path
 * without doubling or dropping the slash between them.
 */
export function url(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const rest = path.replace(/^\/+/, '');
  return rest ? `${base}/${rest}` : `${base}/`;
}
