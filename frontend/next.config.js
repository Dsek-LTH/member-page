// @ts-check

const i18n = require('./next-i18next.config')

/**
 * @type {import('next').NextConfig}
 **/
module.exports = {
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['minio.api.dsek.se', 'minio.api.sandbox.dsek.se'],
  },
  async rewrites() {
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
  ...i18n
};
