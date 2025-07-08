"use client";

import { Schema } from "amplify/data/resource";
import omit from "lodash/omit";
import { useEffect, useState } from "react";
import { ZodError } from "zod";

import PayPalButton, {
  OrderResponseBody,
} from "@/components/payPal/payPalButton/PayPalButton";
import PayPalProvider from "@/components/payPal/payPalProvider/PayPalProvider";
import { useAddOrderMutation } from "@/services/order/useAddOrderMutation";
import { STORE_KEYS, useAppDispatch, useAppSelector } from "@/stores/store";
import { sendEmail } from "@/utils/email";

import { fields } from "./fields";
import { OrderEmailTemplate } from "./orderEmailTemplate";
import { onValidationProps, ProductField } from "./ProductField";

const SpecificationPage = () => {
  const dispatch = useAppDispatch();
  const addOrderMutation = useAddOrderMutation();
  const requiredFieldNames = fields
    .filter((f) => Object.values(f)[0].required)
    .map((f) => Object.keys(f)[0]);

  const [isValidOrderProduct, setIsValidOrderProduct] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    [key: string]: ZodError | null;
  }>({});

  const currentProduct = useAppSelector(
    (state) => state.products.currentProduct
  );
  const currentOrder = useAppSelector((state) => state.order.currentOrder);
  const currentOrderProduct = currentOrder?.products.find(
    (product) => product.productId === currentProduct?.id
  );

  useEffect(() => {
    console.log(
      "useEffect called",
      Object.keys(omit(currentOrderProduct, "productId"))
    );
    console.log("useEffect called", requiredFieldNames);
    setIsValidOrderProduct(
      Object.keys(omit(currentOrderProduct, "productId")).length >=
        requiredFieldNames.length &&
        Object.values(fieldErrors).every((error) => error === null)
    );
  }, [currentOrder, fieldErrors]);

  const handleSuccess = async (details: OrderResponseBody) => {
    // TODO: Add the order to the database

    if (isValidOrderProduct) {
      addOrderMutation.mutateAsync({
        ...currentOrder,
      });

      await sendEmail({
        to: process.env.SMTP_EMAIL,
        subject: "New Order Received",
        html: OrderEmailTemplate(details),
      });
    }
  };

  const handleValidation = ({ fieldName, value, type }: onValidationProps) => {
    if (type === "error") {
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: value as ZodError, // Use the first path element as the key
      }));

      return true;
    }

    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });

    if (!currentOrder) {
      dispatch({
        type: STORE_KEYS.SET_CURRENT_ORDER,
        payload: {
          products: [],
        } as Schema["Order"]["type"],
      });
    }

    dispatch({
      type: STORE_KEYS.UPDATE_ORDER_PRODUCT,
      payload: {
        productId: currentProduct?.id || "",

        updates: { [fieldName]: parseInt(value.toString()) || value },
      } as Schema["OrderProduct"]["type"],
    });

    return false; // No error
  };

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
            <div
              className={`${props.span ? "w-full" : "w-1/2"} py-2 px-4`}
              key={props.name || index}
            >
              <ProductField
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
          amount="31.50"
          onSuccess={handleSuccess}
          disabled={!isValidOrderProduct || !currentOrderProduct}
        />
      </PayPalProvider>
    </div>
  );
};

export default SpecificationPage;
