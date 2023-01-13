const { i18n } = require('./next-i18next.config');

module.exports = {
  i18n,
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
    ];
  }
};
