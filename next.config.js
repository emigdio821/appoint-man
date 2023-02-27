/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['qkvrpadayorldczahhua.supabase.co'],
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['en', 'es'],
    // localeDetection: false,
  },
}

module.exports = nextConfig
