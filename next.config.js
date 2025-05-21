/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    AWS_S3_PRODUCT_IMAGE_PATH: "public/",
    AWS_S3_PRODUCT_IMAGE_URL:
      "https://amplify-awsamplifygen2-wi-wizzingtonproductimages2-24vlfw9xeqsq.s3.eu-west-2.amazonaws.com/",
  },
  images: {
    domains: [
      "amplify-awsamplifygen2-ti-wizzingtonproductimagesb-6tec0zyalwm7.s3.eu-west-2.amazonaws.com/",
    ],
  },
};
export default nextConfig;
