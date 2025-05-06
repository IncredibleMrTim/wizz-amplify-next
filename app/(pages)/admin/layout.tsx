"use client";
import { Authenticator } from "@aws-amplify/ui-react";
import Logout from "@/components/logout/logout";
import CheckAuth from "@/components/auth/Auth";
import Navigation from "@/components/navigation/Navigation";
import { useRouter } from "next/navigation";
import { Button } from "@radix-ui/themes";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow p-4">
        <Authenticator
          variation="modal"
          hideSignUp
          components={{
            Footer: () => (
              <div className="flex w-full justify-end -mt-8 pr-4 ">
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push("/"); // Redirect to home page
                  }}
                >
                  Cancel
                </Button>
              </div>
            ),
          }}
        >
          <CheckAuth />
          <Navigation type="admin" />
          {children}
        </Authenticator>
      </main>
    </div>
  );
};
export default AdminLayout;
