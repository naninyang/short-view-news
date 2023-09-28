/** @type {import('next').NextConfig} */
const withImages = require('next-images');
const withPWA = require('next-pwa');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  pwa: {
    dest: 'public',
    sw: 'service-worker.js',
    runtimeCaching: require('next-pwa/cache'),
  },
};

module.exports = withImages(withPWA(nextConfig));
