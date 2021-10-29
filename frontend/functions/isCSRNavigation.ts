const isCsrNavigation = (req) =>
  !req || (req.url && req.url.startsWith("/_next/data"));

export default isCsrNavigation;
