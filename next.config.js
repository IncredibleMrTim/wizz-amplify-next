/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ROOT_URL: process.env.ROOT_URL,
    S3_PRODUCT_IMAGE_PATH: process.env.S3_PRODUCT_IMAGE_PATH,
    S3_PRODUCT_IMAGE_URL: process.env.S3_PRODUCT_IMAGE_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_PWD: process.env.SMTP_PWD,
    SMTP_EMAIL: process.env.SMTP_EMAIL,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  },
  images: {
    domains: [process.env.S3_IMAGE_DOMAIN],
  },
};
export default nextConfig;
