/** @type {import('next').NextConfig} */
const withImages = require('next-images');
const withPWA = require('next-pwa');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pwa: {
    dest: 'public',
    runtimeCaching: require('next-pwa/cache'),
  },
};

module.exports = withImages(withPWA(nextConfig));
