// eslint-disable-next-line import/prefer-default-export
export function slugify(title: string) {
  let slug = title.replace(/^\s+|\s+$/g, ''); // trim
  slug = slug.toLowerCase();

  // remove accents, swap ñ for n, etc
  const from = 'åäöø·/_,:;';
  const to = 'aaoo------';
  for (let i = 0, l = from.length; i < l; i += 1) {
    slug = slug.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  slug = slug
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-'); // collapse dashes

  return slug;
}
