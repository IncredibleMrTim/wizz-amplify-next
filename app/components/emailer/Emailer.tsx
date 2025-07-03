"use client";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const Emailer = () => {
  const [emailSent, setEmailSent] = useState(false);

  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const subject = (form.elements.namedItem("subject") as HTMLInputElement)
      .value;
    const fromEmail = (form.elements.namedItem("from") as HTMLInputElement)
      .value;
    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement)
      .value;
    const lastName = (form.elements.namedItem("lastName") as HTMLInputElement)
      .value;
    const message = (form.elements.namedItem("message") as HTMLTextAreaElement)
      .value;

    try {
      const res = await fetch("/api/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: process.env.SMTP_EMAIL,
          from: fromEmail,
          subject: "hello world",
          html: `
              <div>
                <p>Hey GTown Festival Admin</p>
                <p>
                  You have a new message from
                  <strong>${firstName} ${lastName}</strong>
                </p>
  
                <h3>Message Details</h3>
                <p><strong>From:</strong> ${fromEmail}</p>
                <p>${message}</p>
              </div>
            `,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailSent(true);
      } else {
        alert("Failed to send email: " + data.error);
      }
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="flex w-full">
      {!emailSent ? (
        <form onSubmit={sendEmail} className="w-full">
          <div className="flex flex-col gap-4 w-full">
            <Input
              type="email"
              name="from"
              required
              placeholder="Your Email"
              className="mt-4 p-2 border rounded"
            />
            <Input
              required
              placeholder="First Name"
              name="firstName"
              className="w-full"
            />
            <Input required placeholder="Last Name" name="lastName" />
            <Input
              type="text"
              name="subject"
              required
              placeholder="Subject"
              className="mt-4 p-2 border rounded"
            />
            <Textarea
              name="message"
              required
              placeholder="Your Message"
              className="mt-4 p-2 border rounded"
            />
          </div>
          <Button
            type="submit"
            variant="default"
            className="flex mt-4 justify-self-end"
          >
            Send Email
          </Button>
        </form>
      ) : (
        <div className="mt-4 text-green-500">
          Email sent successfully! Thank you for your message.
        </div>
      )}
    </div>
  );
};
