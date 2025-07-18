import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@radix-ui/themes";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(process.env.NEXT_PUBLIC_LAMBDA_SIGNIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Sign-in failed");
      }

      // Store tokens in localStorage or secure storage
      localStorage.setItem("accessToken", data.authResult.accessToken);
      localStorage.setItem("idToken", data.authResult.idToken);
      localStorage.setItem("refreshToken", data.authResult.refreshToken);

      // Redirect to dashboard or home page
      window.location.href = "/";
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sign-in-container">
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="form-group">
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
          />
        </div>
        <div className="form-group">
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
};
