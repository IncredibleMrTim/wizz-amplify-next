"use client";
import { Signin } from "@/components/auth/loginSignup/Signin";
import { Signup } from "@/components/auth/loginSignup/Signup";
const LoginPage = ({ groupName }: { groupName?: "user" | "admin" }) => {
  return (
    <div className="flex flex-row justify-center h-full gap-4">
      <div className="flex flex-col p-4 w-1/2 bg-violet-50 gap-4 rounded-lg">
        <p className="!text-lg !h-[80px]">
          Already have an account, sign in to view your details.
        </p>
        <Signin />
      </div>

      <div className="flex flex-col justify-center items-center w-[20px]">
        <div className="flex justify-start bg-gray-200 w-[1px] h-[40%]" />
        <span>or</span>
        <div className="flex justify-end bg-gray-200 w-[1px] h-[40%]" />
      </div>
      <div className="flex flex-col p-4 w-1/2 gap-4 bg-pink-50 rounded-lg h-full">
        <p className="!text-lg !h-[80px]">
          Not Signed up yet? Create an account to start shopping and manage your
          orders.
        </p>
        <Signup groupName={groupName} />
      </div>
    </div>
  );
};

export default LoginPage;
