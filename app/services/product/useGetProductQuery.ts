import { useQuery } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "amplify/data/resource";
import { ProductQueryKeys } from "./keys";

export const useGetProductQuery = (id: string) => {
  const client = generateClient<Schema>();

  const getProduct = async (): Promise<any> => {
    return await client.models.Product.get({ id });
  };

  return useQuery({
    queryKey: [ProductQueryKeys.GET_PRODUCT],
    queryFn: async () => {
      return await getProduct();
    },
  });
};
