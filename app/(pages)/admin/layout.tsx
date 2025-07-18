"use client";
import { Authenticator } from "@aws-amplify/ui-react";
import CheckAuth from "@/components/auth/Auth";

import { useRouter } from "next/navigation";
import { Button } from "@radix-ui/themes";
import { parseJwt, getAccessToken } from "@/utils/auth";

const isAdmin = parseJwt(localStorage.getItem("accessToken"))?.[
  "cognito:groups"
]?.includes("admin");

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">{isAdmin ? children : null}</main>
    </div>
  );
};
export default AdminLayout;
