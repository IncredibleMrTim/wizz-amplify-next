"use client";

import "@/app.css";

import { Flex } from "@radix-ui/themes";
import ProductCard from "@/components/products/productCard/ProductCard";
import { Schema } from "amplify/data/resource";
import { useGetProductsQuery } from "./services/product/useGetProductsQuery";

const FEATURE_PRODUCTS_PER_PAGE = 4;

export default function App() {
  const { data: productsData, isLoading } = useGetProductsQuery({
    count: FEATURE_PRODUCTS_PER_PAGE,
    isFeatured: true,
  });

  return (
    <main>
      <Flex>
        {!isLoading && (
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {productsData.data.map((product: Schema["Product"]["type"]) => (
              <ProductCard
                showDescription={false}
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </Flex>
    </main>
  );
}
