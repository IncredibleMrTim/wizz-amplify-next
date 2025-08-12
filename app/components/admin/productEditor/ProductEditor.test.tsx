import { useParams } from "next/navigation";
import React from "react";

import { renderWithProviders, StoreProps } from "@/testing/utils";
import { screen, render } from "@testing-library/react";

import { ProductEditor } from "./ProductEditor";
import { Schema } from "amplify/data/resource";
import { useGetProductQuery } from "@/services/product/useGetProductQuery";

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
  useGetProductQuery: jest.fn(),
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

describe("ProductEditor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(useParams).mockReturnValue({ productId: "1" });

    (useGetProductQuery as jest.Mock).mockImplementation(() => ({
      getProductById: () => ({
        data: {
          id: "1",
          name: "Test Product",
          description: "Test Description",
          price: 100,
          stock: 10,
          category: "Test Category",
          isFeatured: false,
          isEnquiryOnly: false,
          images: [],
        },
      }),
    }));
  });

  // mock the product store data
  const mockProduct = {
    id: "1",
    name: "Test Product",
    description: "Test Description",
    price: 100,
    stock: 10,
    category: "Test Category",
    isFeatured: true,
    isEnquiryOnly: true,
    images: [
      {
        id: "image1",
        url: "https://example.com/image1.jpg",
        altText: "Image 1",
      },
    ],
  } as unknown as Schema["Product"]["type"];

  const mockStore: StoreProps = {
    preloadedState: { products: { currentProduct: mockProduct } },
    reducer: {
      products: (state = mockProduct, action: any) => state,
    },
  };

  it("renders without crashing", () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

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

  it("renders the form with the product name", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("Product Name", {
        exact: false,
      })
    ).toHaveValue("Test Product");
  });

  it("renders the form with the product description", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("Description", {
        exact: false,
      })
    ).toHaveValue("Test Description");
  });

  it("renders the form with the product price", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("Price", {
        exact: false,
      })
    ).toHaveValue(100);
  });

  it("renders the form with the product stock", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("Stock", {
        exact: false,
      })
    ).toHaveValue(10);
  });

  it("renders the form with the product category", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("category", {
        exact: false,
      })
    ).toHaveTextContent("Category");
  });

  it("renders the form with the product feature product checkbox", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("Feature Product", {
        exact: false,
      })
    ).toBeChecked();
  });

  it("renders the form with the product feature product un-checkbox", async () => {
    const newMockStore = { ...mockStore };
    ((newMockStore.preloadedState = {
      products: { currentProduct: { ...mockProduct, isFeatured: false } },
    }),
      (newMockStore.reducer = {
        products: (state = {}, action: any) => state,
      }));

    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...newMockStore }),
    });

    expect(
      screen.getByLabelText("Feature Product", {
        exact: false,
      })
    ).not.toBeChecked();
  });

  (useGetProductQuery as jest.Mock).mockImplementation(() => ({
    getProductById: () => ({
      data: null, // Simulate no product being loaded
    }),
  }));

  it("renders the form with the product enquiry only checkbox", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(
      screen.getByLabelText("Enquiry Only", {
        exact: false,
      })
    ).toBeChecked();
  });

  it("renders the form with the product enquiry only un-checkbox", async () => {
    const newMockStore = { ...mockStore };
    ((newMockStore.preloadedState = {
      products: { currentProduct: { ...mockProduct, isEnquiryOnly: false } },
    }),
      (newMockStore.reducer = {
        products: (state = {}, action: any) => state,
      }));

    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...newMockStore }),
    });

    expect(
      screen.getByLabelText("Enquiry Only", {
        exact: false,
      })
    ).not.toBeChecked();
  });

  (useGetProductQuery as jest.Mock).mockImplementation(() => ({
    getProductById: () => ({
      data: null, // Simulate no product being loaded
    }),
  }));

  it("renders the submit button with Update Product if product is loaded", async () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    expect(screen.getByRole("submit")).toHaveTextContent("Update Product");
  });

  it("renders the submit button with Create Product if no product is loaded", async () => {
    const newMockStore = { ...mockStore };
    newMockStore.preloadedState = {};
    newMockStore.reducer = {
      products: (state = {}, action: any) => state,
    };

    (useGetProductQuery as jest.Mock).mockImplementation(() => ({
      getProductById: () => ({
        data: null, // Simulate no product being loaded
      }),
    }));

    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({
          children,
          ...newMockStore,
        }),
    });

    expect(screen.getByRole("submit")).toHaveTextContent("Create Product");
  });

  it("renders loaded images from product", () => {
    render(<ProductEditor />, {
      wrapper: ({ children }) =>
        renderWithProviders({
          children,
          ...mockStore,
        }),
    });

    expect(
      screen.getByLabelText("Test Product product image")
    ).toBeInTheDocument();
  });
});
