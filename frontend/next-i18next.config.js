// @ts-check

/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  i18n: {
    locales: ['sv', 'en'],
    defaultLocale: 'sv',
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};