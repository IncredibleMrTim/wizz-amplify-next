"use client";
import { Schema } from "amplify/data/resource";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useGetProductQuery } from "@/services/product/useGetProductQuery";
import { dispatch, STORE_KEYS, useAppSelector } from "@/stores/store";

import { ProductEditor } from "./ProductEditor";

const ProductEditorWrapper = () => {
  const { getProductById } = useGetProductQuery();
  const params = useParams();
  const productId = params.productId?.[0];
  let product =
    useAppSelector((state) => state.products.currentProduct) ||
    getProductById(productId).data;

  useEffect(() => {
    dispatch({
      type: STORE_KEYS.SET_CURRENT_PRODUCT,
      payload: product,
    });
  }, []);

  const updateProductImages = (images: Schema["Product"]["type"]["images"]) => {
    dispatch({
      type: STORE_KEYS.UPDATE_PRODUCT_IMAGES,
      payload: images,
    });
  };

  return (
    <ProductEditor
      updateProductImages={updateProductImages}
      product={product}
    />
  );
};

export default ProductEditorWrapper;
