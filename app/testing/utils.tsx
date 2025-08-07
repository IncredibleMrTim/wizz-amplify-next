import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { ReactQueryProvider } from "./reactQueryProvider";
import { ReducersMapObject } from "@reduxjs/toolkit";

export const renderWithProviders = (
  ui: React.ReactElement,
  store: ReducersMapObject
) => {
  const mockStore = configureStore({
    reducer: store,
    preloadedState: {
      products: { allProducts: [], currentProduct: null },
    },
  });
  return render(
    <Provider store={mockStore}>
      <ReactQueryProvider>{ui}</ReactQueryProvider>
    </Provider>
  );
};
