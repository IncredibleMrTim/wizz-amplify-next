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
import Link from "next/link";
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

const requiredFieldNames = fields
  .filter((f) => Object.values(f)[0].required)
  .map((f) => Object.keys(f)[0]);

export const ProductDetails = () => {
  const dispatch = useAppDispatch();
  const addOrderMutation = useAddOrderMutation();
  const router = useRouter();
  // States
  const [isValidOrderProduct, setIsValidOrderProduct] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    [key: string]: ZodError | null;
  }>({});

  // Selectors
  const currentProduct = useAppSelector(
    (state) => state.products.currentProduct
  );
  const currentOrder = useAppSelector((state) => state.order.currentOrder);
  const currentOrderProduct = currentOrder?.products.find(
    (product) => product.productId === currentProduct?.id
  );

  // check if the order is valid before we show the PayPal button
  useEffect(() => {
    setIsValidOrderProduct(
      Object.keys(omit(currentOrderProduct, "productId")).length >=
        requiredFieldNames.length &&
        Object.values(fieldErrors).every((error) => error === null)
    );
  }, [currentOrder, fieldErrors]);

  /*
   * Handle successful PayPal payment
   * @param orderDetails - The details of the order response from PayPal
   */
  const handleSuccess = async (orderDetails: OrderResponseBody) => {
    if (isValidOrderProduct) {
      addOrderMutation.mutateAsync({
        ...currentOrder,
      });

      await sendEmail({
        to: process.env.SMTP_EMAIL,
        subject: "New Order Received",
        html: OrderEmailTemplate(orderDetails, currentOrder),
      });
    }
  };

  /*
   * Handle validation of product fields
   * @param fieldName - The name of the field being validated
   * @param value - The value of the field being validated
   * @param type - The type of validation field
   * @returns true if there is an error, false otherwise
   */
  const handleValidation = ({ fieldName, value, type }: onValidationProps) => {
    if (type === "error") {
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: value as ZodError,
      }));

      return true;
    }

    // remove field errors if the field is valid
    setFieldErrors((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });

    // If there is no order, create a new one
    if (!currentOrder) {
      dispatch({
        type: STORE_KEYS.SET_CURRENT_ORDER,
        payload: {
          products: [],
        } as Schema["Order"]["type"],
      });
    }

    // Add or update the product in the order
    dispatch({
      type: STORE_KEYS.UPDATE_ORDER_PRODUCT,
      payload: {
        productId: currentProduct?.id || "",
        name: currentProduct?.name || "",
        updates: { [fieldName]: parseInt(value.toString()) || value },
      } as Schema["OrderProduct"]["type"],
    });

    return false;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <p>Please fill out the details below</p>
      </div>

      <div className="flex flex-wrap flex-row gap-y-4 w-full justify-between">
        {fields.map((field, index) => {
          const [name, props] = Object.entries(field)[0];

          return (
            <div
              className={`${props.span ? "w-full" : "w-[48%]"} `}
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
      <div className="flex flex-col w-full items-center gap-4">
        <Button
          disabled={!isValidOrderProduct || !currentOrderProduct}
          onClick={(e) => {
            if (!currentProduct) {
              alert("Product is not available");
            } else {
              router.push(
                `/product/${currentProduct?.name?.replace(/\s+/g, "-")}/productDetails`
              );
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-pink-200 rounded-md hover:bg-pink-300 transition-colors duration-300 !w-full"
        >
          Add to Basket
        </Button>
        <div>Or buy now with PayPal</div>
        <PayPalProvider>
          <PayPalButton
            amount="31.50"
            onSuccess={handleSuccess}
            disabled={!isValidOrderProduct || !currentOrderProduct}
          />
        </PayPalProvider>
      </div>
    </div>
  );
};
