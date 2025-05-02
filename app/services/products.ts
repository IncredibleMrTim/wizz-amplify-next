import { type Schema } from "amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export const addProduct = async (product: Schema["Product"]["type"]) => {
  const result = await client.models.Product.create(product);

  return result;
};

export const getFeaturedProducts = async (count?: number) => {
  const result = await client.models.Product.list({
    filter: {
      isFeatured: { eq: true },
    },
    limit: count ?? 10,
  });

  return result.data;
};
