"use client";

import "@/app.css";

import { Flex } from "@radix-ui/themes";
import ProductCard from "@/components/products/productCard/ProductCard";
import { Schema } from "amplify/data/resource";
import { useGetProductsQuery } from "./services/product/useGetProductsQuery";

export default function App() {
  const { data: productsData } = useGetProductsQuery(3);

  return (
    <main>
      <Flex>
        <div className="flex flex-col md:flex-row gap-4 p-4 justify-between w-full">
          {productsData?.data?.length ? (
            productsData.data.map((product: Schema["Product"]["type"]) => (
              <ProductCard
                showDescription={false}
                key={product.id}
                product={product}
              />
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </Flex>
    </main>
  );
}
