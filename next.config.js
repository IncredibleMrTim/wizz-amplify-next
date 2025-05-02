/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AWS_S3_PRODUCT_IMAGE_PATH: "public/",
    AWS_S3_PRODUCT_IMAGE_BUCKET: "wizzington-product-images",
    AWS_S3_PRODUCT_IMAGE_URL:
      "https://wizzington-products.s3.eu-west-2.amazonaws.com/",
  },
  images: {
    domains: ["wizzington-products.s3.eu-west-2.amazonaws.com"],
  },
};
export default nextConfig;
