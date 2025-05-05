"use server";

import "@/app.css";
import { Amplify } from "aws-amplify";
import outputs from "amplify_outputs.json";
import { getFeaturedProducts } from "@/services/products";
import { Flex, Card } from "@radix-ui/themes";
import ProductCard from "@/components/products/productCard/ProductCard";

Amplify.configure(outputs);

export default async function App() {
  const featuredProducts = await getFeaturedProducts();
  console.log(featuredProducts);
  return (
    <main>
      <Flex>
        <div className="flex flex-col md:flex-row gap-4 p-4 justify-between w-full">
          {featuredProducts?.length ? (
            featuredProducts.map((product) => (
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
