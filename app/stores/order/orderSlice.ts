import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Schema } from "amplify/data/resource";
import { update } from "lodash";

export interface OrderState {
  currentOrder: Schema["Order"]["type"] | null;
  setCurrentOrder: (order: Schema["Order"]["type"] | null) => void;
  addProductToOrder?: (product: Schema["Product"]["type"]) => void;
  updateOrderProduct?: (
    productId: string,
    updates: Partial<Schema["OrderProduct"]["type"]>
  ) => void;
  removeProductFromOrder?: (productId: string) => void;
  clearCurrentOrder?: () => void;
}

const initialSate: OrderState = {
  currentOrder: null,
  setCurrentOrder: () => {},
  addProductToOrder: () => {},
  updateOrderProduct: () => {},
  removeProductFromOrder: () => {},
  clearCurrentOrder: () => {},
};

export const orderSlice = createSlice({
  name: "ORDER",
  initialState: initialSate,
  reducers: {
    setCurrentOrder: (
      state,
      action: PayloadAction<Schema["Order"]["type"]>
    ) => {
      state.currentOrder = action.payload;
    },

    addProductToOrder: (
      state,
      action: PayloadAction<Schema["OrderProduct"]["type"]>
    ) => {
      if (state.currentOrder) {
        state.currentOrder.products.push({
          productId: action.payload.productId,
          quantity: action.payload.quantity,
          ...action.payload,
        });
      }
    },

    updateOrderProduct: (
      state,
      action: PayloadAction<{
        productId: string;
        name?: string;
        uid?: string;
        updates: Partial<Schema["OrderProduct"]["type"]>;
      }>
    ) => {
      if (state.currentOrder) {
        let productIndex = state.currentOrder.products.findIndex(
          (product) => product.uid === action.payload.uid
        );

        // If the product is not in the order then add it
        if (productIndex === -1) {
          state.currentOrder.products.push({
            uid: action.payload.uid || crypto.randomUUID(),
            name: action.payload.name || "",
            productId: action.payload.productId,
            quantity: 1,
          });
        }

        productIndex = state.currentOrder.products.findIndex(
          (product) => product.uid === action.payload.uid
        );

        // if the product is in the order then update it with the new values
        state.currentOrder.products[productIndex] = {
          ...state.currentOrder.products[productIndex],
          ...action.payload.updates,
        };
      }
    },

    removeProductFromOrder: (state, action: PayloadAction<string>) => {
      if (state.currentOrder) {
        state.currentOrder.products = state.currentOrder.products.filter(
          (product) => product.productId !== action.payload
        );
      }
    },
  },
});
export const { setCurrentOrder, addProductToOrder, updateOrderProduct } =
  orderSlice.actions;
export const orderReducer = orderSlice.reducer;
