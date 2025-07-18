"use client";
import { useRouter } from "next/navigation";

import { useAppSelector } from "@/stores/store";
import { useEffect } from "react";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const currentUser = useAppSelector((state) => state.auth.currentUser);

  useEffect(() => {
    // Redirect to home if the user is not an admin
    if (!currentUser?.isAdmin) {
      router.push("/");
    }
  }, [currentUser, router]);

  return (
    <div>
      {currentUser?.isAdmin && (
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow p-4">{children}</main>
        </div>
      )}
    </div>
  );
};
export default AdminLayout;
