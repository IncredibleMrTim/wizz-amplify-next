import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { useParams } from "next/navigation";
import { ProductEditor } from "./ProductEditor";

import { renderWithProviders } from "@/testing/utils";

// Mock next/navigation
jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
    ...actual,
    useParams: jest.fn(),
    useRouter: jest.fn(() => ({
      push: jest.fn(),
    })),
  };
});

// Mock product query/mutation hooks
jest.mock("@/services/product/useGetProductQuery", () => ({
  useGetProductQuery: () => ({
    getProductById: () => ({ data: null }),
  }),
}));
jest.mock("@/services/product/useAddProductMutation", () => ({
  useAddProductMutation: () => ({
    mutateAsync: jest.fn(),
  }),
}));
jest.mock("@/services/product/useUpdateProductMutation", () => ({
  useUpdateProductMutation: () => ({
    mutateAsync: jest.fn(),
  }),
}));

// Minimal reducer for products slice
const mockProductsReducer = (
  state = { allProducts: [], currentProduct: null },
  action: any
) => state;

describe("ProductEditor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useParams).mockReturnValue({ productId: undefined });
  });

  it("renders without crashing", () => {
    renderWithProviders(<ProductEditor />, { products: mockProductsReducer });
  });
});
