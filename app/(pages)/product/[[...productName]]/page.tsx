"use client";
import { useState, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch, STORE_PATHS } from "@/stores/store";
import { useGetProductQuery } from "@/services/product/useGetProductQuery";
import { Schema } from "amplify/data/resource";
import { useParams } from "next/navigation";

const ProductPage = () => {
  const params = useParams();
  const { getProductByName } = useGetProductQuery();
  const dispatch = useAppDispatch();
  const currentProduct = useAppSelector(
    (state) => state.products.currentProduct
  );

  const queryResult = params.productName?.[0]
    ? getProductByName(params.productName[0])
    : null;

  useEffect(() => {
    if (!currentProduct && queryResult?.data) {
      dispatch({
        type: STORE_PATHS.SET_CURRENT_PRODUCT,
        payload: queryResult.data,
      });
    }
  }, [currentProduct, queryResult, dispatch]);

  return (
    <div>
      <h1>Product Page</h1>
      <p>here {currentProduct ? currentProduct?.name : "...Loading"}</p>
    </div>
  );
};
export default ProductPage;
