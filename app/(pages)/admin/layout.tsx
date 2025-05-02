"use client";
import { Authenticator } from "@aws-amplify/ui-react";
import Logout from "@/components/logout/logout";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        <Authenticator>{children}</Authenticator>
        <Logout />
      </main>
    </div>
  );
};
export default AdminLayout;
