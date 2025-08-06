import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { navReducer } from "./navigation/navSlice";
import { authReducer } from "./auth/authSlice";
import { productReducer } from "./product/productSlice";
import { orderReducer } from "./order/orderSlice";

export const STORE_KEYS = {
  SET_PRODUCTS: "PRODUCTS/setProducts",
  SET_CURRENT_PRODUCT: "PRODUCTS/setCurrentProduct",
  SET_ACTIVE_MENU_ITEM: "NAVIGATION/setActiveMenuItem",
  SET_DRAWER_IS_OPEN: "NAVIGATION/setIsDrawerOpen",
  SET_CURRENT_ORDER: "ORDER/setCurrentOrder",
  UPDATE_ORDER_PRODUCT: "ORDER/updateOrderProduct",
  SET_CURRENT_USER: "AUTH/setCurrentUser",
};

export const store = configureStore({
  reducer: {
    nav: navReducer,
    auth: authReducer,
    products: productReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type AppStore = EnhancedStore<RootState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
