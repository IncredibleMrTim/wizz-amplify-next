import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, TypedUseSelectorHook, useSelector } from "react-redux";
import { navReducer } from "./navigation/navSlice";
import { authReducer } from "./auth/authSlice";
import { productReducer } from "./product/productSlice";

export const STORE_PATHS = {
  SET_PRODUCTS: "PRODUCTS/setProducts",
  SET_CURRENT_PRODUCT: "PRODUCTS/setCurrentProduct",
  SET_ACTIVE_MENU_ITEM: "NAVIGATION/setActiveMenuItem",
  SET_DRAWER_IS_OPEN: "NAVIGATION/setIsDrawerOpen",
};

export const store = configureStore({
  reducer: { nav: navReducer, auth: authReducer, products: productReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
