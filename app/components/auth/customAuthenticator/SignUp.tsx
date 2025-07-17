import { useEffect } from "react";
import { signupUser, SignupUserProps } from "./signupUser";

export const SignUp = ({ username, email, groupName }: SignupUserProps) => {
  // Example usage

  useEffect(() => {
    const sign = async () => {
      try {
        const result = await signupUser({
          username,
          email,
          groupName,
        });
        console.log("Success:", result);
        // Handle success (e.g., show success message, redirect, etc.)
      } catch (error) {
        console.error("Error creating user:", error);
        // Handle error (e.g., show error message to user)
      }
    };
    sign();
  }, []);

  return <div>SignUp</div>;
};
