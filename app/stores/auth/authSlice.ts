import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { AuthUser } from "aws-amplify/auth";

export const AUTH_TYPES = {
  SET_CURRENT_USER: "AUTH/setCurrentUser",
};

type User = {
  sub: string;
  iss: string;
  "cognito:username": string;
  given_name: string;
  origin_jti: string;
  aud: string;
  event_id: string;
  token_use: string;
  auth_time: number;
  exp: number;
  iat: number;
  family_name: string;
  jti: string;
  email: string;
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
