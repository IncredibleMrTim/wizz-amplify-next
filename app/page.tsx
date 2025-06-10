"use client";

import "@/app.css";
import { useEffect } from "react";
import ProductCard from "@/components/products/productCard/ProductCard";
import { Schema } from "amplify/data/resource";
import { useGetProductsQuery } from "./services/product/useGetProductsQuery";
import { useAppDispatch, STORE_PATHS } from "@/stores/store";

const FEATURE_PRODUCTS_PER_PAGE = 4;

export default function App() {
  const dispatch = useAppDispatch();
  const { getProducts } = useGetProductsQuery();

  const { data: productsData, isFetched } = getProducts({});

  useEffect(() => {
    if (productsData && isFetched) {
      dispatch({
        type: STORE_PATHS.SET_PRODUCTS,
        payload: productsData,
      });
    }
  }, [productsData, isFetched]);

  return (
    <main>
      <div className="flex flex-col gap-6">
        <p className="px-48 !text-lg text-black opacity-80 font-bold w-full text-center border-y-1 border-gray-200 py-6">
          Costumes that transform every performance into an unforgettable
          spectacle, embracing individuality and artistry.
        </p>

        {isFetched && (
          <div className="flex flex-col md:flex-row gap-6 flex-wrap justify-between">
            {productsData
              ?.filter((p) => p.isFeatured)
              .map((product: Schema["Product"]["type"]) => (
                <ProductCard
                  showDescription={false}
                  key={product.id}
                  product={product}
                />
              ))}
          </div>
        )}
      </div>
    </main>
  );
}
