import { act } from "react";
import { renderHook } from "@testing-library/react";
import { QueryClient } from "@tanstack/react-query";

import { Schema } from "amplify/data/resource";
import { STORE_KEYS, useAppDispatch } from "@/stores/store";
import { useProductEditor } from "./useProductEditor";

import { renderWithProviders } from "@/testing/utils";
import { useParams } from "next/navigation";

const mockAddProductMutation = jest.fn();
const mockUpdateProductMutation = jest.fn();

jest.mock("@/stores/store", () => ({
  ...jest.requireActual("@/stores/store"),
  useAppDispatch: jest.fn(), // Mock useAppDispatch directly
}));

jest.mock("@/services/product/useGetProductQuery", () => ({
  useGetProductQuery: () => ({
    getProductById: jest.fn(() => ({
      data: null, // Simulate no product found
    })),
  }),
}));
jest.mock("@/services/product/useAddProductMutation", () => ({
  useAddProductMutation: () => ({
    mutateAsync: mockAddProductMutation,
  }),
}));
jest.mock("@/services/product/useUpdateProductMutation", () => ({
  useUpdateProductMutation: () => ({
    mutateAsync: mockUpdateProductMutation,
  }),
}));

jest.mock("next/navigation", () => ({
  useParams: jest.fn(() => ({ productId: ["123"] })), // or [] for “new”
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
  })),
}));

jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: jest.fn(() => ({
      getQueryData: jest.fn(),
      setQueryData: jest.fn(),
      invalidateQueries: jest.fn(),
      removeQueries: jest.fn(),
    })),
  };
});

describe("useProductEditor", () => {
  const queryClient = new QueryClient();
  const dispatch = jest.fn();

  // mock the product store data
  const mockProduct = {
    id: "1",
    name: "Test Product",
  };

  const mockStore = {
    preloadedState: { products: { mockProduct } },
    reducer: {
      products: (state = mockProduct, action: any) => state,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();

    // mock the Redux dispatch
    (useAppDispatch as jest.Mock).mockReturnValue(dispatch);
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useProductEditor(), {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    const { product, save, updateImages } = result.current;

    expect(product).toBeNull();
  });

  it("dispatches UPDATE_PRODUCT_IMAGES when updateImages() is called", () => {
    // Create a mock store for this test
    const mockStore = {
      reducer: {
        products: (state = {}, action: any) => state,
      },
      preloadedState: {
        products: (state = mockProduct, action: any) => state,
      },
    };

    const dispatch = jest.fn();
    jest
      .spyOn(require("@/stores/store"), "useAppDispatch")
      .mockReturnValue(dispatch);

    const { result } = renderHook(() => useProductEditor(), {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    const newImages = [
      { url: "https://example.com/image1.jpg", altText: "Image 1" },
    ];

    act(() => {
      result.current.updateImages(newImages);
    });

    expect(dispatch).toHaveBeenCalledWith({
      type: STORE_KEYS.UPDATE_PRODUCT_IMAGES,
      payload: newImages,
    });
  });

  it("should update an existing product when productId is provided", async () => {
    const { result } = renderHook(() => useProductEditor(), {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    const updatedProduct = {
      id: "123",
      name: "Updated Product",
      description: "Updated Description",
      price: 200,
      stockLevel: 20,
      category: "Updated Category",
      isFeatured: true,
      isEnquiryOnly: false,
      images: [],
    } as unknown as Schema["Product"]["type"];

    result.current.save(updatedProduct);

    // Assert that the mutation was called
    expect(mockUpdateProductMutation).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "123",
        name: "Updated Product",
        description: "Updated Description",
        price: 200,
        stockLevel: 20,
        category: "Updated Category",
        isFeatured: true,
        isEnquiryOnly: false,
        images: [],
      })
    );
  });

  it("should save a new product when no current product exists", async () => {
    (useParams as jest.Mock).mockReturnValue({});
    const { result } = renderHook(() => useProductEditor(), {
      wrapper: ({ children }) =>
        renderWithProviders({ children, ...mockStore }),
    });

    await act(async () => {
      const newProduct = {
        name: "New Product",
        description: "New Description",
        price: 100,
        stockLevel: 10,
        category: "New Category",
        isFeatured: false,
        isEnquiryOnly: false,
        images: [],
      } as unknown as Schema["Product"]["type"];

      result.current.save(newProduct);

      expect(mockAddProductMutation).toHaveBeenCalledWith({
        ...newProduct,
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });
  });
});
