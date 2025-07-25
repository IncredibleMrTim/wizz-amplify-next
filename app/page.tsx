"use client";

import "@/app.css";
import { useEffect } from "react";
import ProductCard from "@/components/products/productCard/ProductCard";
import { Schema } from "amplify/data/resource";
import { useGetProductsQuery } from "./services/product/useGetProductsQuery";
import { useAppDispatch, STORE_KEYS } from "@/stores/store";
import { Separator } from "./components/separator/Separator";

import { jwtDecode } from "jwt-decode";

const FEATURE_PRODUCTS_PER_PAGE = 4;

export default function App() {
  const dispatch = useAppDispatch();
  const { getProducts } = useGetProductsQuery();
  const { data: productsData, isFetched } = getProducts({});

  useEffect(() => {
    if (productsData && isFetched) {
      dispatch({
        type: STORE_KEYS.SET_PRODUCTS,
        payload: productsData,
      });
    }
  }, [productsData, isFetched]);

  return (
    <main>
      <div className="flex flex-col">
        <Separator />
        <p className="md:px-48 !text-lg text-black opacity-80 font-bold w-full text-center p-6">
          Costumes that transform every performance into an unforgettable
          spectacle, embracing individuality and artistry.
        </p>
        <Separator />

        {isFetched && (
          <div className="flex flex-row flex-wrap justify-between mt-2">
            {productsData.some((p) => p.isFeatured) ? (
              productsData
                ?.filter((p) => p?.isFeatured ?? false)
                ?.map((product: Schema["Product"]["type"]) => (
                  <ProductCard
                    showDescription={false}
                    key={product.id}
                    product={product}
                  />
                ))
            ) : (
              <p className="text-center w-full mt-12">
                No products are available at the moment. Please check back soon!
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
