import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Schema } from "amplify/data/resource";

export interface ProductState {
  allProducts: Schema["Product"]["type"][];
  currentProduct: Schema["Product"]["type"] | null;
  setProducts: (allProducts: Schema["Product"]["type"] | null) => void;
  setCurrentProduct: (currentProduct: Schema["Product"]["type"] | null) => void;
  clearCurrentProduct?: () => void;
  updateProductImages: (images: Schema["Product"]["type"]["images"]) => void;
  updateAllProducts?: (product: Schema["Product"]["type"]) => void;
}

const initialSate: ProductState = {
  allProducts: [],
  currentProduct: null,
  setProducts: () => {},
  setCurrentProduct: () => {},
  clearCurrentProduct: () => {},
  updateProductImages: () => {},
  updateAllProducts: (product: Schema["Product"]["type"]) => {
    // This function can be used to update the product in the allProducts array
    // if needed, but it's not implemented here.
  },
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
    updateProductImages: (
      state,
      action: PayloadAction<Schema["Product"]["type"]["images"]>
    ) => {
      if (state.currentProduct) {
        state.currentProduct.images = action.payload;
      }
    },
    updateAllProductsWithNewProduct: (
      state,
      action: PayloadAction<Schema["Product"]["type"]>
    ) => {
      const index = state.allProducts.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.allProducts[index] = action.payload;
      } else {
        state.allProducts.push(action.payload);
      }
    },
  },
});
export const {
  setProducts,
  setCurrentProduct,
  clearCurrentProduct,
  updateProductImages,
  updateAllProductsWithNewProduct,
} = productSlice.actions;
export const productReducer = productSlice.reducer;
