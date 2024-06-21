// next.config.mjs
import axios from 'axios';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Ping the sitemap generation API when the server starts
      axios.get('http://localhost:3000/api/sitemap')
          .then(response => console.log('Sitemap generated'))
          .catch(error => console.error('Error generating sitemap', error));
    }
    return config;
  },
};

export default nextConfig;
