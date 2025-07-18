import { AuthUser } from "aws-amplify/auth";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
      state.currentUser = action.payload;
    },
  },
});
export const { setCurrentUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
