"use client";

import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch } from "@/stores/redux/store";
import { AUTH_TYPES } from "@/stores/auth/authSlice";

export default function Logout() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true); // Set loading state
    try {
      await signOut(); // Ensure sign-out completes
      dispatch({
        type: AUTH_TYPES.SET_CURRENT_USER,
        payload: null,
      });
      router.push("/"); // Redirect after sign-out
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false); // Reset loading state (optional)
    }
  };

  return (
    <button
      onClick={handleSignOut}
      className="px-2 bg-white text-black"
      disabled={isSigningOut} // Disable button while signing out
    >
      {isSigningOut ? "Signing out..." : "Logout"}
    </button>
  );
}
