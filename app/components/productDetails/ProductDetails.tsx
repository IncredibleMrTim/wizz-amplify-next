"use client";

import { Schema } from "amplify/data/resource";
import omit from "lodash/omit";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PiBasket } from "react-icons/pi";
import { ZodError } from "zod";

import PayPalButton, {
  OrderResponseBody,
} from "@/components/payPal/payPalButton/PayPalButton";
import PayPalProvider from "@/components/payPal/payPalProvider/PayPalProvider";
import {
  onValidationProps,
  ProductField,
} from "@/components/productFields/ProductField";
import { Button } from "@/components/ui/button";
import { useAddOrderMutation } from "@/services/order/useAddOrderMutation";
import { STORE_KEYS, useAppDispatch, useAppSelector } from "@/stores/store";
import { sendEmail } from "@/utils/email";

import { fields } from "./fields";
import { OrderEmailTemplate } from "./orderEmailTemplate";

const requiredFieldNames = fields
  .filter((f) => Object.values(f)[0].required)
  .map((f) => Object.keys(f)[0]);

export const ProductDetails = () => {
  const dispatch = useAppDispatch();
  const addOrderMutation = useAddOrderMutation();
  const router = useRouter();
  // States
  const [isValidOrderProduct, setIsValidOrderProduct] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, ZodError | null>
  >({});
  const [productDetails, setProductDetails] = useState<Record<string, unknown>>(
    {}
  );
  const [actionType, setActionType] = useState<"purchase" | "basket">(null);

  // Selectors

  const clearCurrentOrder = useAppSelector(
    (state) => state.order.clearCurrentOrder
  );
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
      Object.keys(omit(productDetails, "productId")).length >=
        requiredFieldNames.length &&
        Object.values(fieldErrors).every((error) => error === null)
    );
  }, [productDetails, fieldErrors]);

  const addProductToOrder = () => {
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
        uid: crypto.randomUUID(),
        price: currentProduct?.price || 0,
        updates: productDetails,
      } as Schema["OrderProduct"]["type"],
    });
  };
  /*
   * Handle successful PayPal payment
   * @param orderDetails - The details of the order response from PayPal
   */
  const handleSuccess = async (orderDetails: OrderResponseBody) => {
    const newOrder = {
      id: orderDetails.id,
      products: [
        {
          productId: currentProduct?.id || "",
          name: currentProduct?.name || "",
          quantity: currentOrderProduct?.quantity || 1,
          ...productDetails,
        },
      ],
      totalAmount: currentProduct?.price || 0,
      status: "Pending", // This can be updated based on your business logic
    } as Schema["Order"]["type"];

    if (isValidOrderProduct) {
      addOrderMutation.mutateAsync({
        ...currentOrder,
      });

      setActionType("purchase");

      await sendEmail({
        to: process.env.SMTP_EMAIL,
        subject: "New Order Received",
        html: OrderEmailTemplate(orderDetails, newOrder),
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

    setProductDetails((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    return false;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Order Details</h1>
        <p>Please add product details below</p>
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
      <div className="flex flex-row w-full items-center gap-4">
        {actionType !== "purchase" && actionType !== "basket" ? (
          <div className="flex gap-4 w-full h-full">
            <Button
              disabled={!isValidOrderProduct || !productDetails}
              onClick={(e) => {
                if (!currentProduct) {
                  alert("Product is not available");
                } else {
                  setActionType("basket");
                  addProductToOrder();
                }
              }}
              className="flex items-center-safe justify-center"
            >
              Add to Basket <PiBasket size={20} />
            </Button>

            <div className="flex flex-col justify-center items-center w-[20px] h-3/4">
              <div className="bg-gray-200 w-[1px] h-[40%]" />

              <span
                className={`${!isValidOrderProduct || !productDetails ? "text-gray-400" : "text-black"}`}
              >
                or
              </span>

              <div className="bg-gray-200 w-[1px] h-[40%]" />
            </div>
            <PayPalProvider>
              <PayPalButton
                amount="31.50"
                onSuccess={handleSuccess}
                disabled={!isValidOrderProduct || !productDetails}
              />
            </PayPalProvider>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 w-full">
            {actionType === "basket" ? (
              <>
                <div>Your item has been added to your basket</div>
                <Button onClick={() => router.push("/")}>View Basket</Button>
              </>
            ) : (
              <div>Thanks for your purchase</div>
            )}
            <Button
              onClick={() => {
                router.push("/");
                clearCurrentOrder();
              }}
            >
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
