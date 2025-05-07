import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Schema } from "amplify/data/resource";

export interface ProductState {
  allProducts: Schema["Product"]["type"][];
  setProducts: (allProducts: Schema["Product"]["type"] | null) => void;
}

const initialSate: ProductState = {
  allProducts: [],
  setProducts: () => {},
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
  },
});
export const { setProducts } = productSlice.actions;
export const productReducer = productSlice.reducer;
