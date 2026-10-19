/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  async redirects() {
    return [
      {
        source: '/rate/:sku',
        destination: 'https://pricelist.orelli.co.in/rates/:sku',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
