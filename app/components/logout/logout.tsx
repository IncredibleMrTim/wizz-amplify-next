"use client";

import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Logout() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true); // Set loading state
    try {
      await Auth.signOut(); // Ensure sign-out completes
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
      {isSigningOut ? "Signing out..." : "Sign out"}
    </button>
  );
}
