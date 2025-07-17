export interface SignupUserProps {
  username: string;
  email: string;
  groupName: string;
}
export async function signupUser({
  username,
  email,
  groupName,
}: SignupUserProps) {
  try {
    const response = await fetch(process.env.LAMBDA_AUTH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        groupName,
      }),
    });

    // Get the response as text first
    const responseText = await response.text();
    console.log("Raw response:", responseText);

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse response as JSON:", e);
      throw new Error(
        `Server returned invalid JSON: ${responseText.substring(0, 100)}...`
      );
    }

    // Check if the response indicates an error
    if (!response.ok) {
      throw new Error(
        data.message || `Error: ${response.status} ${response.statusText}`
      );
    }

    return data;
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
}
