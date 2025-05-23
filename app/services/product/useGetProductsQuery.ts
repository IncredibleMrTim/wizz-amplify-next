"use client";
import { useQuery } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "amplify/data/resource";
import { ProductQueryKeys } from "./keys";

const client = generateClient<Schema>();

interface UseGetProductsQueryProps {
  refetch?: boolean;
}

export const useGetProductsQuery = () => {
  const fetchProducts = async (count?: number, isFeatured?: boolean) => {
    return await client.models.Product.list();
  };

  const getProducts = ({ refetch }: UseGetProductsQueryProps) =>
    useQuery({
      queryKey: [ProductQueryKeys.GET_PRODUCTS],
      queryFn: async () => {
        return await fetchProducts();
      },
      staleTime: refetch ? 0 : 1000 * 60 * 5, // 5 minutes
      select: (data) => {
        return data?.data ?? [];
      },
    });

  return {
    getProducts,
  };
};
