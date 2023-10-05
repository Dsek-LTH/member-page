const { i18n } = require('./next-i18next.config');
const removeImports = require('next-remove-imports')();

module.exports = removeImports({
  i18n,
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['minio.api.dsek.se', 'minio.api.sandbox.dsek.se'],
  },
  experimental: {
    headers() {
      return [
        {
          source: "/.well-known/apple-app-site-association",
          headers: [{ key: "content-type", value: "application/json" }]
        }
      ];
    }
  },
  async rewrites() {
    return [
      {
        source: '/salto/:path*',
        destination: '/api/door/:path*',
      },
      {
        source: '/(\\breglemente\\b|\\bregulations\\b)',
        destination: '/api/pdf/reglemente%2Freleases%2Flatest%2Fdownload%2Freglemente.pdf',
      },
      {
        source: '/(\\bstadgar\\b|\\bstatutes\\b)',
        destination: '/api/pdf/stadgar%2Freleases%2Flatest%2Fdownload%2Fstadgar.pdf',
      },
    ];
  },
});
