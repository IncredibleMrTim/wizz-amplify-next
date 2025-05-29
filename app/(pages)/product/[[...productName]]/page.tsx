"use client";
import { useState, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch, STORE_PATHS } from "@/stores/store";
import { useGetProductQuery } from "@/services/product/useGetProductQuery";
import { Schema } from "amplify/data/resource";
import { useParams } from "next/navigation";
import { Form } from "@/components/shad/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TbRulerMeasure } from "react-icons/tb";
import { FiCalendar } from "react-icons/fi";
import { PiBasket } from "react-icons/pi";
import { HiShare } from "react-icons/hi2";
import { z } from "zod";
import Link from "next/link";
import { FormField as FField } from "./FormField";
import { FaFacebook } from "react-icons/fa6";

const formSchema = z.object({
  waistSize: z.coerce.number().min(0, { message: "Waist size is required" }),
  chestSize: z.coerce.number().min(0, { message: "Chest size is required" }),
  height: z.coerce
    .number()
    .min(0, { message: "Height is required" })
    .nullable(),
  notes: z
    .string()
    .max(1000, { message: "Maximum character length exceeded" })
    .optional(),
  quantity: z.coerce
    .number()
    .min(0, { message: "Stock must be a positive number" })
    .max(4, {
      message: "Maximum quantity is 4",
    }),

  deliveryDate: z.date(),
});

const ProductPage = () => {
  const params = useParams();

  const { getProductByName } = useGetProductQuery();
  const dispatch = useAppDispatch();
  const currentProduct = useAppSelector(
    (state) => state.products.currentProduct
  );

  // Fetch current product is not already in state
  // this allows deep linking to product pages
  const queryResult = params.productName?.[0]
    ? getProductByName(params.productName[0], !currentProduct)
    : null;

  useEffect(() => {
    if (!currentProduct && queryResult?.data) {
      dispatch({
        type: STORE_PATHS.SET_CURRENT_PRODUCT,
        payload: queryResult.data,
      });
    }
  }, [currentProduct, queryResult, dispatch]);

  // TODO: this needs to be relative to the  current lead time of products
  const defaultDate = () => {
    const today = new Date();
    today.setDate(today.getDate() + 7); // Set default date to 7 days from today
    return today;
  };

  const form = useForm<
    z.infer<typeof formSchema>,
    any,
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
  });

  const formFields = [
    {
      waistSize: {
        label: "Waist Size",
        placeholderText: "Enter your waist size",
        icon: TbRulerMeasure,
        variant: "number",
      },
    },
    {
      chestSize: {
        label: "Chest Size",
        placeholderText: "Enter your chest size",
        icon: TbRulerMeasure,
        variant: "number",
      },
    },
    {
      quantity: {
        label: "Quantity",
        placeholderText: "Enter quantity",
        icon: PiBasket,
        variant: "number",
      },
    },
    {
      deliveryDate: {
        label: "Delivery Date",
        placeholderText: "Select delivery date",
        icon: FiCalendar,
        variant: "date",
      },
    },
    {
      notes: {
        label: "Additional Information",
        placeholderText:
          "Describe any additional information you would like to provide",
        variant: "textarea",
        classes: {
          formItem: "flex flex-col items-start w-full",
        },
      },
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <meta
        name="og:image"
        content={`${process.env.AWS_S3_PRODUCT_IMAGE_URL}${currentProduct?.imageUrl}`}
      />
      <meta
        name="og:title"
        content={`Wizzington Moo's Boutique - ${currentProduct?.name}`}
      />
      <meta
        name="og:description"
        content={`Checkout this product i found on Wizzington Moo's Boutique: ${currentProduct?.name}.`}
      />
      <meta
        name="og:url"
        content={`${process.env.ROOT_URL}/product/${currentProduct?.name.replace(
          /\s+/g,
          "-"
        )}`}
      />
      <div className="flex justify-between flex-row gap-16">
        <div className="flex flex-col gap-4 w-3/5">
          <div className="flex flex-col gap-4">
            <h1>{currentProduct ? currentProduct?.name : "...Loading"}</h1>
            <div className="flex flex-col gap-4">
              <p className="whitespace-pre-wrap">
                {currentProduct?.description}
              </p>
              <div className="flex items-center justify-between w-full">
                <p className="!font-bold !text-lg">
                  Price: £{currentProduct?.price}
                </p>
                <Link
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    `${process.env.ROOT_URL}/product/${currentProduct?.name.replace(
                      /\s+/g,
                      "-"
                    )}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-2 opacity-70 hover:opacity-100 transition-opacity w-auto"
                >
                  Share on Facebook:
                  <FaFacebook size={20} />
                </Link>
              </div>
              <hr />
            </div>
          </div>
          <div>
            <Form {...form}>
              <form className="flex flex-wrap flex-row gap-y-4 items-start w-full">
                {formFields.map((field, index) => {
                  const [name, props] = Object.entries(field)[0];
                  return (
                    <FField key={name} form={form} name={name} {...props} />
                  );
                })}
              </form>
            </Form>
          </div>
        </div>
        <div className="flex justify-center w-2/5">
          <img
            src={`${process.env.AWS_S3_PRODUCT_IMAGE_URL}${currentProduct?.imageUrl}`}
            alt={currentProduct?.name}
            className="flex h-fit"
          />
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
