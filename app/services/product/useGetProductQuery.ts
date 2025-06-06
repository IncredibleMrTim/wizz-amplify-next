import { useQuery } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "amplify/data/resource";
import { ProductQueryKeys } from "./keys";

export const useGetProductQuery = () => {
  const client = generateClient<Schema>();

  const fetchProductById = async (id: string): Promise<any> => {
    return await client.models.Product.get({ id });
  };

  const fetchProductByName = async (name: string): Promise<any> => {
    return await client.models.Product.list({
      filter: {
        name: {
          eq: name.replace(/-/g, " "),
        },
      },
    });
  };

  const getProductById = (id: string) =>
    useQuery({
      queryKey: [ProductQueryKeys.GET_PRODUCT],
      queryFn: async (context) => {
        return await fetchProductById(id);
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    });

  const getProductByName = (name: string, enabled?: boolean) =>
    useQuery({
      queryKey: [ProductQueryKeys.GET_PRODUCT],
      queryFn: async (context) => {
        const data = await fetchProductByName(name);
        return data?.data?.[0] ?? null;
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      select: (data) => {
        return data ?? null;
      },
      enabled: enabled,
    });

  return {
    getProductById,
    getProductByName,
  };
};
