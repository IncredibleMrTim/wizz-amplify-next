"use client";
import { Authenticator } from "@aws-amplify/ui-react";
import CheckAuth from "@/components/auth/Auth";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen mt-12">
      <main className="flex-grow p-4">
        <Authenticator
          hideSignUp
          variation="modal"
          components={{
            Footer: () => (
              <div className="flex w-full justify-end -mt-8 pr-4 ">
                <Button
                  variant="ghost"
                  onClick={() => {
                    router.push("/");
                  }}
                >
                  Cancel
                </Button>
              </div>
            ),
          }}
        >
          <CheckAuth />

          {children}
        </Authenticator>
      </main>
    </div>
  );
};
export default AdminLayout;
