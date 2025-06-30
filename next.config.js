/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ROOT_URL: process.env.ROOT_URL,
    S3_PRODUCT_IMAGE_PATH: process.env.S3_PRODUCT_IMAGE_PATH,
    S3_PRODUCT_IMAGE_URL: process.env.S3_PRODUCT_IMAGE_URL,
  },
  images: {
    domains: [process.env.S3_IMAGE_DOMAIN],
  },
};
export default nextConfig;
