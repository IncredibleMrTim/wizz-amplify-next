/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ROOT_URL: process.env.ROOT_URL,
    S3_PRODUCT_IMAGE_PATH: process.env.S3_PRODUCT_IMAGE_PATH,
    S3_PRODUCT_IMAGE_URL: process.env.S3_PRODUCT_IMAGE_URL,
    S3_IMAGE_DOMAIN: process.env.S3_IMAGE_DOMAIN,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_PWD: process.env.SMTP_PWD,
    SMTP_EMAIL: process.env.SMTP_EMAIL,
    SMTP_FROM: process.env.SMTP_FROM,
    NEXT_PUBLIC_LAMBDA_SIGNUP_URL: process.env.NEXT_PUBLIC_LAMBDA_SIGNUP_URL,
    NEXT_PUBLIC_LAMBDA_SIGNIN_URL: process.env.NEXT_PUBLIC_LAMBDA_SIGNIN_URL,
    NEXT_PUBLIC_LAMBDA_REFRESH_TOKEN_URL:
      process.env.NEXT_PUBLIC_LAMBDA_REFRESH_TOKEN_URL,
  },
  images: {
    domains: [process.env.S3_IMAGE_DOMAIN],
  },
};
export default nextConfig;
