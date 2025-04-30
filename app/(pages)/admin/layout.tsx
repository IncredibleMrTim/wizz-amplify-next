"use client";
import { Authenticator } from "@aws-amplify/ui-react";
import Logout from "@/app/components/logout/logout";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl">Admin Dashboard</h1>
      </header>
      <main className="flex-grow p-4">
        <Authenticator>{children}</Authenticator>
        <Logout />
      </main>
    </div>
  );
};
export default AdminLayout;
