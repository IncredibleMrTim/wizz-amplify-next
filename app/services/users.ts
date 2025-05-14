"use client";
import {
  fetchAuthSession,
  getCurrentUser,
  fetchUserAttributes,
} from "@aws-amplify/auth";

export const getUserCredentials = async () => {
  const credentials = await fetchAuthSession();
  const user = await getCurrentUser();
  const attrs = await fetchUserAttributes();

  return {
    credentials,
    user,
    attrs,
  };
};
