"use client";
import { type Schema } from "amplify/data/resource";
import { useMutation, UseMutationResult } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import { OrderMutationKeys } from "./keys";

const client = generateClient<Schema>();

export const useAddOrderMutation = (): UseMutationResult<
  Schema["Order"]["type"] | null,
  unknown,
  Schema["Order"]["type"]
> => {
  const addOrder = async (order: Schema["Order"]["type"]) => {
    try {
      const result = await client.models.Order.create(order);
      return result.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw new Error(`Failed to create order: ${error}`);
    }
  };

  return useMutation({
    mutationKey: [OrderMutationKeys.CREATE_ORDER],
    mutationFn: (order: Schema["Order"]["type"]) => addOrder(order),
  });
};
