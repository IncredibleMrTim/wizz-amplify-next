"use client";

import { useState } from "react";
import { ZodError } from "zod";

import PayPalButton, { OrderResponseBody } from "@/components/payPal/payPalButton/PayPalButton";
// Define OrderResponseBody type locally since it's not exported by PayPal types

import PayPalProvider from "@/components/payPal/payPalProvider/PayPalProvider";
import { useAppSelector } from "@/stores/store";
import { sendEmail } from "@/utils/email"; // Adjust the import path as necessary

import { fields } from "./fields";
import { OrderEmailTemplate } from "./orderEmailTemplate";
import { OrderField } from "./OrderField";

const OrderDetailsPage = () => {
  const [fieldErrors, setFieldErrors] = useState<{
    [key: string]: ZodError | null;
  }>({});
  const [fieldData, setFieldData] = useState<{ [key: string]: string }>({});
  const currentProduct = useAppSelector(
    (state) => state.products.currentProduct
  );

  const requiredFieldNames = fields
    .map((field) => Object.keys(field)[0])
    .filter(
      (name) =>
        name !== "deliveryDate" && name !== "spacer1" && name !== "notes"
    );

  const allRequiredFieldsFilled = requiredFieldNames.every(
    (name) => fieldData[name] && fieldData[name] !== ""
  );

  const handleSuccess = async (details: OrderResponseBody) => {
    console.log("Transaction completed by:", details);
    await sendEmail({
      to: process.env.SMTP_EMAIL,
      subject: "New Order Received",
      html: OrderEmailTemplate(details),
    });
  };

  const handleValidation = (
    fieldName: string,
    value: ZodError | string | null
  ) => {
    if (typeof value === "object") {
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: value as ZodError, // Use the first path element as the key
      }));

      return true; // Indicate that there was an error
    }

    setFieldErrors((prev) => {
      const newErrors = { ...prev };

      // Remove the error if the field is now valid
      if (typeof value === "string" && value.trim() !== "") {
        delete newErrors[fieldName];
      }
      return newErrors;
    });

    setFieldData((prev) => ({ ...prev, [fieldName]: value }));
    return false; // No error
  };

  // Disable if any field has an error
  const hasAnyError = Object.values(fieldErrors).some(Boolean);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <p>
          Fill out the form below to place your order for {currentProduct?.name}
        </p>
        <p>
          Nunc porttitor porttitor ante vitae suscipit. Donec pretium purus et
          est aliquet tempor. Mauris maximus et dolor pulvinar fringilla. In
          dignissim eros porta felis laoreet mollis. Aliquam erat volutpat.
          Etiam mollis ex ut quam pretium, eget ullamcorper erat blandit. In a
          libero eget orci malesuada ornare. Praesent vulputate eros quis quam
          aliquet, pulvinar luctus justo aliquam.
        </p>
      </div>

      <div className="flex flex-wrap flex-row gap-y-4 w-full">
        {fields.map((field, index) => {
          const [name, props] = Object.entries(field)[0];

          return (
            <div className="w-1/2 py-2 px-4" key={props.name || index}>
              <OrderField
                {...props}
                name={name}
                onValidation={handleValidation}
              />
            </div>
          );
        })}
      </div>

      <PayPalProvider>
        <PayPalButton
          amount="22.50"
          onSuccess={handleSuccess}
          disabled={!allRequiredFieldsFilled || hasAnyError}
        />
      </PayPalProvider>
    </div>
  );
};

export default OrderDetailsPage;
