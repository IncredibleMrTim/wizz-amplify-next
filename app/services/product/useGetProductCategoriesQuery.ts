import { useQuery } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "amplify/data/resource";
import { ProductQueryKeys } from "./keys";

export const useGetProductQuery = () => {
  const client = generateClient<Schema>();

  const getProductCategories = () =>
    useQuery({
      queryKey: [ProductQueryKeys.GET_PRODUCT_CATEGORIES],
      queryFn: async () => {
        return await client.models.Category.list();
      },

      select: (data) => {
        return data?.data ?? null;
      },
    });

  const getProductsByCategoryId = (id: string) =>
    useQuery({
      queryKey: [ProductQueryKeys.GET_PRODUCTS_BY_CATEGORY],
      queryFn: async () => {
        const data = await client.models.Product.list({
          filter: {
            category: {
              eq: id,
            },
          },
        });
        return data?.data ?? null;
      },

      select: (data) => {
        return data ?? null;
      },
      enabled: !!id,
    });

  return {
    getProductCategories,
    getProductsByCategoryId,
  };
};
