import { add } from 'lodash';
import { useForm } from 'react-hook-form';
import zod from 'zod';

import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@radix-ui/themes';

import { signupUser } from './signupUser';

export const Signup = ({ groupName }: { groupName?: "user" | "admin" }) => {
  const formDataSchema = zod.object({
    username: zod.string().min(1, "Username is required"),
    firstName: zod.string().min(1, "First name is required"),
    lastName: zod.string().min(1, "Last name is required"),
    password: zod.string().min(6, "Password must be at least 6 characters"),
    email: zod.string().email("Invalid email address"),
  });

  const form = useForm({
    resolver: zodResolver(formDataSchema),
    defaultValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
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
              firstName: data.firstName,
              lastName: data.lastName,
              email: data.email,
              groupName,
            });
            console.log("User signed up successfully:", result);
          } catch (error) {
            console.error("Error signing up user:", error);
          }
        })}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="First name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Last name" />
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
                <Input type="email" {...field} placeholder="Email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder="Username" />
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
                <Input type="password" {...field} placeholder="Password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="surface">
          Sign Up
        </Button>
      </form>

      <FormMessage />
    </Form>
  );
};
