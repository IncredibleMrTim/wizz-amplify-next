import { Schema } from "amplify/data/resource";
import * as nextNavigation from "next/navigation";

import { renderWithProviders } from "@/testing/utils";
import { screen } from "@testing-library/dom";

import { BreadCrumb } from "./BreadCrumb";

// Mock usePathname
jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
    ...actual,
    usePathname: jest.fn(),
  };
});

jest.mock("@/components/breadCrumb/breadcrumbMappings");

const mockProduct = {
  id: "1",
  name: "Test Product",
} as unknown as Schema["Product"]["type"];

const mockProductsReducer = (
  state = {
    currentProduct: mockProduct,
    allProducts: [mockProduct],
  },
  action: any
) => state;

describe("BreadCrumb", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders breadcrumb links for a simple path", () => {
    renderWithProviders(
      <BreadCrumb
        pathname="/product/test-product"
        product={mockProduct}
        segments={["product", "shoes"]}
      />,
      {
        products: mockProductsReducer,
      }
    );

    expect(screen.getByText(/Products/)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
  });

  it("does not render on admin path", async () => {
    jest.mocked(nextNavigation.usePathname).mockReturnValue("/admin/dashboard");

    renderWithProviders(
      <BreadCrumb pathname="/admin/dashboard" segments={["admin"]} />,
      {
        products: mockProductsReducer,
      }
    );

    expect(screen.queryByText(/Products/)).not.toBeInTheDocument();
  });

  it("should replace hyphens with a space in product names", () => {
    const productWithHyphen = {
      ...mockProduct,
      name: "Test-Product",
    } as unknown as Schema["Product"]["type"];

    renderWithProviders(
      <BreadCrumb
        pathname="/product/test-product"
        product={productWithHyphen}
        segments={["product", "test-product"]}
      />,
      {
        products: mockProductsReducer,
      }
    );

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
  });
});
