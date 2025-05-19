"use client";
import { useQuery } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "amplify/data/resource";
import { ProductQueryKeys } from "./keys";

const client = generateClient<Schema>();

export const useGetProductsQuery = (count?: number, isFeatured?: boolean) => {
  const getProducts = async (): Promise<any> => {
    return await client.models.Product.list({
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
      filter: isFeatured
        ? {
            isFeatured: { eq: isFeatured },
          }
        : undefined,
      limit: count ?? 10,
    });
  };

  return useQuery({
    queryKey: [ProductQueryKeys.GET_PRODUCTS],
    queryFn: async () => {
      return await getProducts();
    },
  });
};
