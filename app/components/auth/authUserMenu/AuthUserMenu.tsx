"use client";

import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { AUTH_TYPES } from "@/stores/auth/authSlice";
import { FiLogOut, FiHome, FiSettings } from "react-icons/fi";
import Link from "next/link";

export const AuthUserMenu = ({
  onMenuItemClick,
}: {
  onMenuItemClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      await signOut();

      await caches.delete("auth");

      dispatch({
        type: AUTH_TYPES.SET_CURRENT_USER,
        payload: null,
      });
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsSigningOut(false);
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <p>
        Welcome {currentUser?.given_name} {currentUser?.family_name}
      </p>
      <ul className="flex flex-col gap-2 mt-4">
        <li className="flex gap-4">
          <FiHome size={22} className="text-gray-400" />

          <Link
            prefetch
            href="/"
            className="!text-black"
            onClick={onMenuItemClick}
          >
            Home Page
          </Link>
        </li>
        <li className="flex gap-4">
          <FiSettings size={22} className="text-gray-400" />

          <Link
            prefetch
            href="/admin"
            className="!text-black"
            onClick={onMenuItemClick}
          >
            Admin
          </Link>
        </li>
        <li className="flex gap-4">
          <FiLogOut size={22} className="text-gray-400" />
          <Link
            prefetch
            onClick={(e) => {
              handleSignOut();
              onMenuItemClick(e);
            }}
            href="/"
            className="!text-black"
          >
            {isSigningOut ? "Signing out..." : "Logout"}
          </Link>
        </li>
      </ul>
    </div>
  );
};
