import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { BreadCrumb } from "./BreadCrumb";
import * as nextNavigation from "next/navigation";
import { render } from "@testing-library/react";

// Mock usePathname
jest.mock("next/navigation", () => {
  const actual = jest.requireActual("next/navigation");
  return {
    ...actual,
    usePathname: jest.fn(),
  };
});

// Minimal reducer for products slice
const mockProductsReducer = (
  state = { currentProduct: { name: "Test Product" } }
) => state;

function renderWithStore(ui: React.ReactElement) {
  const mockStore = configureStore({
    reducer: {
      products: mockProductsReducer,
    },
    preloadedState: {
      products: { currentProduct: { name: "Test Product" } },
    },
  });
  return render(<Provider store={mockStore}>{ui}</Provider>);
}

describe("BreadCrumb", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders breadcrumb links for a simple path", () => {
    jest.mocked(nextNavigation.usePathname).mockReturnValue("/products/shoes");

    const { getByText } = renderWithStore(<BreadCrumb />);

    expect(getByText(/products/i)).toBeInTheDocument();
    expect(getByText(/shoes/i)).toBeInTheDocument();
  });

  it("does not render on admin path", () => {
    jest.mocked(nextNavigation.usePathname).mockReturnValue("/admin/dashboard");

    const { container } = renderWithStore(<BreadCrumb />);
    expect(container).toBeEmptyDOMElement();
  });
});
