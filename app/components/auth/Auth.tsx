"use client";
import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";
import { usePathname } from "next/navigation";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector, STORE_KEYS } from "@/stores/store";

import { getCurrentUser } from "aws-amplify/auth";

const CheckAuth = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  useEffect(() => {
    async function checkAuth() {
      try {
        // Fetch the current user from the server
        // This is necessary to ensure that the user is authenticated
        // will throw an error if the user is not authenticated
        await getCurrentUser();
        const user = await AuthGetCurrentUserServer();

        // only set the user if it is not already set
        // so that we don't continuously update the state
        if (user && !currentUser) {
          dispatch({
            type: STORE_KEYS.SET_CURRENT_USER,
            payload: { ...user, isAdmin: true },
          });
        }
      } catch (error) {
        dispatch({
          type: STORE_KEYS.SET_CURRENT_USER,
          payload: null,
        });
        await caches.delete("idToken");
        await caches.delete("accessToken");
        await caches.delete("refreshToken");
      }
    }

    checkAuth();
  }, [pathname]);

  return null;
};

export default CheckAuth;
