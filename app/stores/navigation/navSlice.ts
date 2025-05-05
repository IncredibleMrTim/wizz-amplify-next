import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { MenuItem, MenuItems } from "./types";

export interface NavState {
  menuItems: MenuItem[];
  isDrawerOpen: boolean;

  setActiveMenuItem: (menuItem: MenuItem) => void;
  setIsDrawerOpen: (isOpen: boolean) => void;
}

const initialSate = {
  menuItems: [
    { name: MenuItems.HOME, path: "/", isActive: true },
    { name: MenuItems.DRESSES, path: "/dresses", isActive: false },
    {
      name: MenuItems.PAGEANT_ACCESSORIES,
      path: "/pageant-accessories",
      isActive: false,
    },
    {
      name: MenuItems.DANCE_ACCESSORIES,
      path: "/dance-accessories",
      isActive: false,
    },
  ],
  isDrawerOpen: false,
};

export const navSlice = createSlice({
  name: "navigation",
  initialState: initialSate,
  reducers: {
    setActiveMenuItem: (state, action: PayloadAction<MenuItem>) => {
      console.log("setActiveMenuItem", action.payload);
      state.menuItems = state.menuItems.map((item) => ({
        ...item,
        isActive: item.name === action.payload.name,
      }));
    },
    setIsDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
  },
});
export const { setActiveMenuItem, setIsDrawerOpen } = navSlice.actions;
export const navReducer = navSlice.reducer;
