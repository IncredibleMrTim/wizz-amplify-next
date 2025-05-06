// components/Login.tsx
"use client";

import { withAuthenticator } from "@aws-amplify/ui-react";
import { AuthUser } from "aws-amplify/auth";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "@/stores/redux/store";
import { AUTH_TYPES } from "@/stores/auth/authSlice";

export function Login({ user }: { user?: AuthUser }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      dispatch({
        type: AUTH_TYPES.SET_CURRENT_USER,
        payload: user,
      });
      redirect("/");
    }
  }, [user]);
  return null;
}
