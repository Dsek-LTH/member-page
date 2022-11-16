/**
 * Checks if the request is from a client side rendered navigation
 * i.e. a user navigating from one page to another
 */
const isCsrNavigation = (req?: { url: string }) =>
  !req || (req.url && req.url.startsWith('/_next/data'));

export default isCsrNavigation;
