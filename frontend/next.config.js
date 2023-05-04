const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['minio.api.dsek.se', 'minio.api.sandbox.dsek.se'],
  },
  experimental: {
    headers()
    {
      return [
        {
          source: "/.well-known/apple-app-site-association",
          headers: [{ key: "content-type", value: "application/json" }]
        }
      ];
    }
  },
  async rewrites()
  {
    return [
      {
        source: '/salto/:path*',
        destination: '/api/door/:path*',
      },
      {
        source: '/(\\breglemente\\b|\\bregulations\\b)',
        destination: 'https://github.com/Dsek-LTH/reglemente/releases/latest/download/reglemente.pdf',
      },
      {
        source: '/(\\bstadgar\\b|\\bstatutes\\b)',
        destination: 'https://github.com/Dsek-LTH/stadgar/releases/latest/download/stadgar.pdf',
      },
    ];
  },
};
