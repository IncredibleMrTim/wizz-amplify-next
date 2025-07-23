"use client";
import { fetchAuthSession, fetchUserAttributes } from "aws-amplify/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

import { STORE_KEYS, useAppDispatch } from "@/stores/store";
import { parseJwt, removeTokens, setTokens } from "@/utils/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  // Check for existing tokens on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authSession = await fetchAuthSession();
        const userAttributes = await fetchUserAttributes();

        if (authSession) {
          const isExpired =
            Date.now() >= authSession.tokens.accessToken.payload.exp * 1000;

          if (!isExpired) {
            dispatch({
              type: STORE_KEYS.SET_CURRENT_USER,
              payload: {
                given_name: userAttributes.given_name,
                family_name: userAttributes.family_name,
                email: userAttributes.email,
                isAdmin: true,
              },
            });
            setIsAuthenticated(true);
          } else {
            // Token expired, try to refresh
            await refreshTokens();
          }
        }
      } catch (error) {
        // console.error("Authentication error:", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);

      const response = await fetch(process.env.NEXT_PUBLIC_LAMBDA_SIGNIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store tokens securely
      setTokens(
        data.authResult.accessToken,
        data.authResult.idToken,
        data.authResult.refreshToken
      );

      // Extract user info from ID token
      const payload = parseJwt(data.authResult.idToken);
      dispatch({
        type: STORE_KEYS.SET_CURRENT_USER,
        payload: {
          sub: payload.sub,
          iss: payload.iss,
          "cognito:username": payload["cognito:username"],
          given_name: payload.given_name,
          origin_jti: payload.origin_jti,
          aud: payload.aud,
          event_id: payload.event_id,
          token_use: payload.token_use,
          auth_time: payload.auth_time,
          exp: payload.exp,
          iat: payload.iat,
          family_name: payload.family_name,
          jti: payload.jti,
          email: payload.email,
          isAdmin: false,
        },
      });

      setUser({
        username: payload["cognito:username"],
        email: payload.email,
        // Add other user attributes as needed
      });

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Refresh tokens function
  const refreshTokens = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch("YOUR_REFRESH_TOKEN_LAMBDA_URL", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Token refresh failed");
      }

      // Update stored tokens
      setTokens(data.authResult.accessToken, data.authResult.idToken);

      // Extract user info from new ID token
      const payload = parseJwt(data.authResult.idToken);
      setUser({
        username: payload["cognito:username"],
        email: payload.email,
        // Add other user attributes as needed
      });

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Clear all tokens

    removeTokens();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Get access token (with automatic refresh if needed)
  const getAccessToken = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        return null;
      }

      // Check if token is expired
      const payload = parseJwt(accessToken);
      const isExpired = Date.now() >= payload.exp * 1000;

      if (isExpired) {
        // Try to refresh the token
        const success = await refreshTokens();
        if (success) {
          return localStorage.getItem("accessToken");
        }
        return null;
      }

      return accessToken;
    } catch (error) {
      console.error("Error getting access token:", error);
      return null;
    }
  };

  const value = {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    getAccessToken,
    refreshTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
