import { useParams } from "next/navigation";
import React from "react";

import { renderWithProviders } from "@/testing/utils";
import { screen } from "@testing-library/react";

import { ProductEditor } from "./ProductEditor";

// Mock next/navigation
jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
    ...actual,
    useParams: jest.fn().mockReturnValue({ productId: "1" }),
    useRouter: jest.fn(() => ({
      push: jest.fn(),
    })),
  };
});

// Mock product query/mutation hooks
jest.mock("@/services/product/useGetProductQuery", () => ({
  useGetProductQuery: () => ({
    getProductById: () => ({
      data: {
        id: "1",
        name: "Test Product",
        description: "Test Description",
        price: 100,
        stockLevel: 10,
        category: "Test Category",
        isFeatured: false,
        isEnquiryOnly: false,
        images: [],
      },
    }),
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
  state = {
    allProducts: [
      {
        id: "1",
        name: "Test Product",
        description: "Test Description",
        price: 100,
        stockLevel: 10,
        category: "Test Category",
        isFeatured: false,
        isEnquiryOnly: false,
        images: [],
      },
    ],
    currentProduct: null,
  },
  action: any
) => state;

describe("ProductEditor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useParams).mockReturnValue({ productId: "1" });
  });

  it("renders without crashing", () => {
    renderWithProviders(<ProductEditor />, { products: mockProductsReducer });
    expect(
      screen.getByText(/Enter the name of the product./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Enter the product description./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Enter the product price \(£\)\./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Enter the product stock level./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /Marking a product as Featured will display it on the home page./
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Select product category./)).toBeInTheDocument();

    expect(
      screen.getByText(/Check this box to feature the product./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Check this box to mark the product as Enquiry Only./)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Drag and drop files here, or click to select files./)
    ).toBeInTheDocument();
  });

  it("renders existing product data when editing", () => {
    renderWithProviders(<ProductEditor />, { products: mockProductsReducer });
  });
});
