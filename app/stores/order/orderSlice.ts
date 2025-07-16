import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { Schema } from "amplify/data/resource";
import { update } from "lodash";

export interface OrderState {
  currentOrder: Schema["Order"]["type"] | null;
  setCurrentOrder: (order: Schema["Order"]["type"] | null) => void;
  addProductToOrder?: (product: Schema["Product"]["type"]) => void;
  updateOrderProduct?: (
    productId: string,
    updates: Partial<Schema["OrderProduct"]["type"]>,
    price?: number
  ) => void;
  removeProductFromOrder?: (productId: string) => void;
  clearCurrentOrder?: () => void;
  updateTotalCost?: (cost: number) => void;
  // productPrices?: Record<string, number>;
  totalCost?: number;
}

const initialSate: OrderState = {
  currentOrder: null,
  setCurrentOrder: () => {},
  addProductToOrder: () => {},
  updateOrderProduct: () => {},
  removeProductFromOrder: () => {},
  clearCurrentOrder: () => {},
  updateTotalCost: (cost: number) => {},
  // productPrices: {},
  totalCost: 0,
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
        price?: number;
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
            price: action.payload.price || 0,
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

        // state.productPrices = {
        //   ...state.productPrices,
        //   [action.payload.uid]: action.payload.price || 0,
        // };
        state.totalCost =
          state.totalCost +
          action.payload.price * (action.payload.updates.quantity || 1);
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
