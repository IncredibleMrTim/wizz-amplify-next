import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "aws-amplify/auth";

export const AUTH_TYPES = {
  SET_CURRENT_USER: "AUTH/setCurrentUser",
};

export interface AuthState {
  currentUser: AuthUser | null;
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
    setCurrentUser: (state, action: PayloadAction<AuthUser>) => {
      state.currentUser = action.payload;
    },
  },
});
export const { setCurrentUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
