import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export const addProduct = async (product: Schema["Product"]["type"]) => {
  const result = await client.models.Product.create(product);

  return result;
};

export const getFeaturedProducts = async () => {
  const result = await client.models.Product.list({
    filter: {
      feature: { eq: true },
    },
  });

  return result;
};
