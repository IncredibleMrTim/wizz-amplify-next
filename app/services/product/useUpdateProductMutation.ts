"use client";
import { Schema } from "amplify/data/resource";
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
    if (!product.id) {
      throw new Error("Product id is required for update.");
    }
    const result = await client.models.Product.update(
      product as Schema["Product"]["type"] & { id: string }
    );

    if (result?.data) {
      return result.data;
    }

    throw new Error(`Failed to update product: ${result.errors}`);
  };

  return useMutation({
    mutationKey: [ProductMutationKeys.UPDATE_PRODUCT],
    mutationFn: (product: Schema["Product"]["type"]) => updateProduct(product),
  });
};
