"use client";

import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";
import { usePathname } from "next/navigation";

import { useEffect } from "react";
import { useAppDispatch } from "@/stores/redux/store";
import { AUTH_TYPES } from "@/stores/auth/authSlice";

const CheckAuth = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await AuthGetCurrentUserServer();
        if (currentUser) {
          console.log("User is authenticated:", currentUser);
          dispatch({
            type: AUTH_TYPES.SET_CURRENT_USER,
            payload: currentUser,
          });
        } else {
          console.log("User is not authenticated");
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
