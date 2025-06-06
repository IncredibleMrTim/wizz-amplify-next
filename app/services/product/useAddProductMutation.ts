"use client";
import { type Schema } from "amplify/data/resource";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import { ProductMutationKeys } from "./keys";

const client = generateClient<Schema>();

export const useAddProductMutation = (): UseMutationResult<
  Schema["Product"]["type"] | null,
  unknown,
  Schema["Product"]["type"]
> => {
  const addProduct = async (product: Schema["Product"]["type"]) => {
    try {
      const result = await client.models.Product.create(product);
      console.log("result", result);
      console.log("Product product:", product);
      return result.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error(`Failed to create product: ${error}`);
    }
  };

  return useMutation({
    mutationKey: [ProductMutationKeys.CREATE_PRODUCT],
    mutationFn: (product: Schema["Product"]["type"]) => addProduct(product),
  });
};
