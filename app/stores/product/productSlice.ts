import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Schema } from "amplify/data/resource";

export interface ProductState {
  allProducts: Schema["Product"]["type"][];
  currentProduct: Schema["Product"]["type"] | null;
  setProducts: (allProducts: Schema["Product"]["type"] | null) => void;
  setCurrentProduct: (currentProduct: Schema["Product"]["type"] | null) => void;
  clearCurrentProduct?: () => void;
}

const initialSate: ProductState = {
  allProducts: [],
  currentProduct: null,
  setProducts: () => {},
  setCurrentProduct: () => {},
  clearCurrentProduct: () => {},
};

export const productSlice = createSlice({
  name: "PRODUCTS",
  initialState: initialSate,
  reducers: {
    setProducts: (
      state,
      action: PayloadAction<Schema["Product"]["type"][]>
    ) => {
      state.allProducts = action.payload;
    },
    setCurrentProduct: (
      state,
      action: PayloadAction<Schema["Product"]["type"] | null>
    ) => {
      state.currentProduct = action.payload;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
});
export const { setProducts, setCurrentProduct, clearCurrentProduct } =
  productSlice.actions;
export const productReducer = productSlice.reducer;
