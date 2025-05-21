"use client";

import "@/app.css";

import { Flex } from "@radix-ui/themes";
import ProductCard from "@/components/products/productCard/ProductCard";
import { Schema } from "amplify/data/resource";
import { useGetProductsQuery } from "./services/product/useGetProductsQuery";

const FEATURE_PRODUCTS_PER_PAGE = 4;

export default function App() {
  const { data: productsData, isFetched } = useGetProductsQuery({
    isFeatured: true,
  });

  console.log(productsData);

  return (
    <main>
      <Flex>
        {isFetched && (
          <div className="flex flex-col md:flex-row gap-6 justify-between">
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
