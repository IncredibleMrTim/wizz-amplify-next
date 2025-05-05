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
  console.log("User credentials:", credentials, user, attrs);

  return {
    credentials,
    user,
    attrs,
  };
};
