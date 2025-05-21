"use client";
import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";
import { usePathname } from "next/navigation";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { AUTH_TYPES } from "@/stores/auth/authSlice";

const CheckAuth = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  useEffect(() => {
    async function checkAuth() {
      try {
        const authorized = await AuthGetCurrentUserServer();

        // if we are not authorized user, we need to set the current user to null
        // so that user cannot access the protected routes
        if (!authorized) {
          console.log("User is not authenticated");
          dispatch({
            type: AUTH_TYPES.SET_CURRENT_USER,
            payload: null,
          });
        }

        console.log("auth && !currentUser", authorized, currentUser);

        // only set the user if it is not already set
        // so that we don't continuously update the state
        if (authorized && !currentUser) {
          console.log("User is logged in", currentUser);
          dispatch({
            type: AUTH_TYPES.SET_CURRENT_USER,
            payload: authorized,
          });
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    }

    checkAuth();
  }, [pathname]);

  return null;
};

export default CheckAuth;
