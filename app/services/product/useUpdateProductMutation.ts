"use client";
import { type Schema } from "amplify/data/resource";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import { ProductMutationKeys } from "./keys";

const client = generateClient<Schema>();

export const useUpdateProductMutation = (): UseMutationResult<
  Schema["Product"]["type"],
  unknown,
  Schema["Product"]["type"]
> => {
  const updateProduct = async (product: Schema["Product"]["type"]) => {
    const result = await client.models.Product.update(product);

    if (result?.data) {
      return result.data;
    }

    // Handle error case
    throw new Error(`Failed to create product: ${result.errors}`);
  };

  return useMutation({
    mutationKey: [ProductMutationKeys.UPDATE_PRODUCT],
    mutationFn: (product: Schema["Product"]["type"]) => updateProduct(product),
  });
};
