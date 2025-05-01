/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AWS_S3_PRODUCT_IMAGE_PATH: "product-pictures",
    AWS_S3_PRODUCT_IMAGE_BUCKET: "wizzington-product-images",
  },
};

module.exports = nextConfig;
