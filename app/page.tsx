"use server";

import "@/app.css";

import { getFeaturedProducts } from "@/services/products";
import { Flex } from "@radix-ui/themes";
import ProductCard from "@/components/products/productCard/ProductCard";
import { Schema } from "amplify/data/resource";

export default async function App() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <main>
      <Flex>
        <div className="flex flex-col md:flex-row gap-4 p-4 justify-between w-full">
          {featuredProducts?.length ? (
            featuredProducts.map((product: Schema["Product"]["type"]) => (
              <ProductCard
                showDescription={false}
                key={product.id}
                product={product}
              />
            ))
          ) : (
            <p>No featured products available</p>
          )}
        </div>
      </Flex>
    </main>
  );
}
