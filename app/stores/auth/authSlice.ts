import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "aws-amplify/auth";

export type User = {
  given_name: string;
  family_name: string;
  email: string;
  isAdmin: boolean;
};

export interface AuthState {
  currentUser: User | null;
  setCurrentUser: (currentUser: AuthUser | null) => void;
}

const initialSate: AuthState = {
  currentUser: null,
  setCurrentUser: () => {},
};

export const authSlice = createSlice({
  name: "AUTH",
  initialState: initialSate,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<User>) => {
      console.log("Setting current user:", action.payload);
      state.currentUser = action.payload;
    },
  },
});
export const { setCurrentUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
