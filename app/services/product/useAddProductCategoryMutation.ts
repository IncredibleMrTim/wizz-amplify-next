"use client";
import { type Schema } from "amplify/data/resource";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import { ProductMutationKeys } from "./keys";

const client = generateClient<Schema>();

export const useAddProductCategoryMutation = (): UseMutationResult<
  Schema["Category"]["type"] | null,
  unknown,
  Schema["Category"]["type"]
> => {
  const addProductCategory = async (product: Schema["Category"]["type"]) => {
    try {
      const result = await client.models.Product.create(product);

      return result.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error(`Failed to create product: ${error}`);
    }
  };

  return useMutation({
    mutationKey: [ProductMutationKeys.CREATE_PRODUCT_CATEGORY],
    mutationFn: (product: Schema["Category"]["type"]) =>
      addProductCategory(product),
  });
};
