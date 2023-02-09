/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: 'es',
    locales: ['en', 'es'],
    // localeDetection: false,
  },
}

module.exports = nextConfig
