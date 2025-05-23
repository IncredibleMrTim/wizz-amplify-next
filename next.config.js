/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ROOT_URL: "https://main.d3nzem3wi6drcl.amplifyapp.com/",
    AWS_S3_PRODUCT_IMAGE_PATH: "public/",
    AWS_S3_PRODUCT_IMAGE_URL:
      "https://amplify-d3nzem3wi6drcl-ma-wizzingtonproductimages2-n1ubggik41v2.s3.eu-west-2.amazonaws.com/",
  },
  images: {
    domains: [
      "amplify-d3nzem3wi6drcl-ma-wizzingtonproductimages2-n1ubggik41v2.s3.eu-west-2.amazonaws.com/",
    ],
  },
};
export default nextConfig;
