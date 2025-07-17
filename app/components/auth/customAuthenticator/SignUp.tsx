import { useEffect } from "react";
import { signupUser, SignupUserProps } from "./signupUser";
import { useForm } from "react-hook-form";
import zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const SignUp = ({ groupName }: { groupName?: "user" | "admin" }) => {
  const formDataSchema = zod.object({
    username: zod.string().min(1, "Username is required"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
    email: zod.string().email("Invalid email address"),
  });

  const form = useForm({
    resolver: zodResolver(formDataSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          try {
            const result = await signupUser({
              username: data.username,
              password: data.password,
              email: data.email,
              groupName,
            });
            console.log("User signed up successfully:", result);
          } catch (error) {
            console.error("Error signing up user:", error);
          }
        })}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input {...field} placeholder="Username" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input type="password" {...field} placeholder="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <input type="email" {...field} placeholder="Email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Sign Up</button>
      </form>
      <FormDescription>Please fill in the form to sign up.</FormDescription>
      <FormMessage />
    </Form>
  );
};
