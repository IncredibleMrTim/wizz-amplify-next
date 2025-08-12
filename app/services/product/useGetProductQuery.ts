import { useQuery, UseQueryOptions } from "@tanstack/react-query";
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

  const getProductById = ({
    id,
    enabled,
  }: {
    id: string;
    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: [ProductQueryKeys.GET_PRODUCT, id],
      queryFn: async () => {
        return await fetchProductById(id);
      },
      staleTime: 0,
      select: (data) => {
        return data?.data ?? null;
      },

      enabled,
    });
  };

  const getProductByName = (name: string) =>
    useQuery({
      queryKey: [ProductQueryKeys.GET_PRODUCT],
      queryFn: async () => {
        const data = await fetchProductByName(name);
        return data?.data?.[0] ?? null;
      },

      select: (data) => {
        return data ?? null;
      },
      enabled: !!name,
    });

  return {
    getProductById,
    getProductByName,
  };
};
