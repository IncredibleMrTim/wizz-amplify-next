"use client";
import { AuthGetCurrentUserServer } from "@/utils/amplify-utils";
import { usePathname } from "next/navigation";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { AUTH_TYPES } from "@/stores/auth/authSlice";
import { fetchAuthSession } from "aws-amplify/auth";

const CheckAuth = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  useEffect(() => {
    async function checkAuth() {
      try {
        const credentials = (await fetchAuthSession({ forceRefresh: true }))
          .credentials;

        if (credentials?.expiration && credentials.expiration > new Date()) {
          const user = await AuthGetCurrentUserServer();

          // only set the user if it is not already set
          // so that we don't continuously update the state
          if (user && !currentUser) {
            dispatch({
              type: AUTH_TYPES.SET_CURRENT_USER,
              payload: user,
            });
          }
        } else {
          // if we are not authorized user, we need to set the current user to null
          // so that user cannot access the protected routes

          dispatch({
            type: AUTH_TYPES.SET_CURRENT_USER,
            payload: null,
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
