/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ROOT_URL: process.env.ROOT_URL,
    AWS_S3_PRODUCT_IMAGE_PATH: process.env.AWS_S3_PRODUCT_IMAGE_PATH,
    AWS_S3_PRODUCT_IMAGE_URL: process.env.AWS_S3_PRODUCT_IMAGE_URL,
  },
  images: {
    domains: [process.env.AWS_S3_IMAGE_DOMAIN],
  },
};
export default nextConfig;
