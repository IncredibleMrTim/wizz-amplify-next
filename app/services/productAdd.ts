import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/data";

export const addProduct = async (product: Schema['Product']['type']) => {
  const client = generateClient<Schema>();
  console.log("Adding product", product);
  const result = await client.models.Product.create(product);

  return result;
};
