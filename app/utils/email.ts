export type EmailAttachments = {
  filename: string;
  path: string;
  cid: string;
};

export interface SendEmailProps {
  to: string;
  from?: string;
  subject: string;
  message?: string;
  firstName?: string;
  lastName?: string;
  html?: string;
  attachments?: EmailAttachments[];
}

export const sendEmail = async ({
  to,
  from,
  subject,
  message,
  firstName,
  lastName,
  html,
  attachments,
}: SendEmailProps) => {
  console.log("html", html);

  try {
    const res = await fetch("/api/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        from: from ?? process.env.SMTP_EMAIL,
        subject,
        attachments,
        html,
      }),
    });
    const data = await res.json();
    if (data.success) {
      return Promise.resolve(true);
    }
    return Promise.reject(new Error(data.error || "Failed to send email"));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
