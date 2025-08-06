"use client";
import { Schema } from "amplify/data/resource";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import { ProductMutationKeys } from "./keys";

const client = generateClient<Schema>();

export const useUpdateProductCategoryMutation = (): UseMutationResult<
  Schema["Category"]["type"],
  unknown,
  Schema["Category"]["type"]
> => {
  const updateProductCategory = async (
    category: Schema["Category"]["type"]
  ) => {
    if (!category.id) {
      throw new Error("Category id is required for update.");
    }
    const result = await client.models.Category.update(
      category as Schema["Category"]["type"] & { id: string }
    );

    if (result?.data) {
      return result.data;
    }

    throw new Error(`Failed to update category: ${result.errors}`);
  };

  return useMutation({
    mutationKey: [ProductMutationKeys.UPDATE_PRODUCT_CATEGORY],
    mutationFn: (category: Schema["Category"]["type"]) =>
      updateProductCategory(category),
  });
};
