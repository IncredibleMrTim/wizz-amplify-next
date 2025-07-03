export type emailAttachments = {
  filename: string;
  path: string;
  cid: string;
};

interface sendEmailProps {
  to: string;
  from?: string;
  subject: string;
  message?: string;
  firstName?: string;
  lastName?: string;
  html?: string;
}

export const sendEmail = async ({
  to,
  from,
  subject,
  message,
  firstName,
  lastName,
  html,
}: sendEmailProps) => {
  console.log("Sending email to:", to);
  console.log("Email subject:", subject);
  console.log("Email from:", from ?? process.env.SMTP_EMAIL);
  console.log("Email firstName:", firstName);
  console.log("Email lastName:", lastName);
  console.log("Email message:", message);

  try {
    const res = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        from: from ?? process.env.SMTP_EMAIL,
        subject,
        html:
          html ??
          `
              <div>
                <p>Hey GTown Festival Admin</p>
                <p>
                  You have a new message from
                  <strong>${firstName} ${lastName}</strong>
                </p>
  
                <h3>Message Details</h3>
                <p><strong>From:</strong> ${from}</p>
                <p>${message}</p>
              </div>
            `,
      }),
    });
    const data = await res.json();
    if (data.success) {
      console.log("Email sent successfully");
      return Promise.resolve(true, data);
    }
    return Promise.reject(new Error(data.error || "Failed to send email"));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
