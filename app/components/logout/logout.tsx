"use client";

import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch } from "@/stores/redux/store";
import { AUTH_TYPES } from "@/stores/auth/authSlice";
import { Button, Separator } from "@radix-ui/themes";
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
    <div className="flex align-middle">
      <Button
        variant="ghost"
        size="3"
        onClick={() => router.push("/admin")}
        className="  !text-black"
        disabled={isSigningOut} // Disable button while signing out
      >
        Admin
      </Button>
      <Separator orientation="vertical" className="h-4 mx-2 mt-1" />
      <Button
        variant="ghost"
        size="3"
        onClick={handleSignOut}
        className="  !text-black"
        disabled={isSigningOut} // Disable button while signing out
      >
        {isSigningOut ? "Signing out..." : "Logout"}
      </Button>
    </div>
  );
}
