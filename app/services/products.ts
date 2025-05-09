import { type Schema } from "amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient();

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

export const updateProduct = async (product: Schema["Product"]["type"]) => {
  console.log("update", product);
  const result = await client.models.Product.update(product);

  return result;
};

export const getProduct = async (id: string) => {
  const result = await client.models.Product.get({ id: id });
  console.log("result", result.data);
  return result.data;
};

export const getProducts = async (count?: number) => {
  const result = await client.models.Product.list({
    selectionSet: [
      "id",
      "name",
      "description",
      "price",
      "imageUrl",
      "category",
      "isFeatured",
      "stock",
    ],
  });

  return result.data;
};
