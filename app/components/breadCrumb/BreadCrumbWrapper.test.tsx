import BreadCrumbWrapper from "./BreadCrumbWrapper";
import { renderWithProviders } from "@/testing/utils";

// Mock usePathname
jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
    ...actual,
    usePathname: jest.fn().mockReturnValue("/product/test-product"),
  };
});

describe("BreadCrumbWrapper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockProductsReducer = (
    state = {
      currentProduct: {
        id: "1",
        name: "Test Product",
      },
      allProducts: [
        {
          id: "1",
          name: "Test Product",
        },
      ],
    },
    action: any
  ) => state;

  it("should render the breadcrumb component", () => {
    const { container } = renderWithProviders(<BreadCrumbWrapper />, {
      products: mockProductsReducer,
    });
    expect(container.querySelector("nav")).toBeInTheDocument();
  });
});
