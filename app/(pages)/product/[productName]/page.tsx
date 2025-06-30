"use client";
import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch, STORE_PATHS } from "@/stores/store";
import { useGetProductQuery } from "@/services/product/useGetProductQuery";
import { useParams } from "next/navigation";
import { Form } from "@/components/shad/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TbRulerMeasure } from "react-icons/tb";
import { FiCalendar, FiEdit } from "react-icons/fi";
import { PiBasket } from "react-icons/pi";
import { z } from "zod";
import Link from "next/link";
import { FormField as FField } from "./FormField";
import { FaFacebook } from "react-icons/fa6";
import { Schema } from "amplify/data/resource";

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
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const { getProductByName } = useGetProductQuery();
  const dispatch = useAppDispatch();
  const currentProduct = useAppSelector(
    (state) => state.products.currentProduct
  );
  const isAdmin = useAppSelector((state) => state.auth.currentUser);

  // Fetch current product is not already in state
  // this allows deep linking to product pages
  const queryResult = params.productName?.[0]
    ? getProductByName(params.productName[0])
    : null;

  useEffect(() => {
    if (!currentProduct && queryResult?.data) {
      dispatch({
        type: STORE_PATHS.SET_CURRENT_PRODUCT,
        payload: queryResult.data,
      });
    }
  }, [currentProduct, queryResult, dispatch]);

  const form = useForm<
    z.infer<typeof formSchema>,
    any,
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
  });

  // Measurements ;
  // Chest
  // Waist
  // Hips
  // Girth
  // Head
  // Neck
  // Bicep
  // Armpit to wrist
  // Wrist
  // Inseam (crotch to ankle )
  // Waist to ankle
  // Waist to floor
  // Ankle

  const formFields = [
    {
      chestSize: {
        label: "Chest Size (Circumference Around Chest)",
        placeholderText: "Enter chest size",
        // // icon: TbRulerMeasure,
        variant: "number",
      },
    },
    {
      waistSize: {
        label: "Waist Size (Circumference Around Waist)",
        placeholderText: "Enter waist size",
        // // icon: TbRulerMeasure,
        variant: "number",
      },
    },
    {
      hipsSize: {
        label: "Hip Size (Circumference Around Hips)",
        placeholderText: "Enter hip size",
        // // icon: TbRulerMeasure,
        variant: "number",
      },
    },
    {
      girth: {
        label: "Girth Measurement (Around the Body)",
        placeholderText: "Girth measurement",
        // icon: TbRulerMeasure,
        variant: "number",
      },
    },
    {
      headSize: {
        label: "Head Size (Hat Size)",
        placeholderText: "Enter head size",
        // icon: TbRulerMeasure,
        variant: "number",
      },
    },
    {
      neckSize: {
        label: "Neck Size (Collar Size)",
        placeholderText: "Enter neck size",
        // icon: TbRulerMeasure,
        variant: "number",
      },
    },
    {
      bicepSize: {
        label: "Bicep Size (Upper Arm Circumference)",
        placeholderText: "Enter bicep size",
        // icon: TbRulerMeasure,
        variant: "number",
      },
    },
    {
      armpitToWrist: {
        label: "Armpit to Wrist (Arm Length)",
        placeholderText: "Enter armpit to wrist",
        // icon: TbRulerMeasure,
        variant: "number",
      },
    },
    {
      wristSize: {
        label: "Wrist Size",
        placeholderText: "Enter wrist size",
        // icon: TbRulerMeasure,
        variant: "number",
      },
    },
    {
      inseam: {
        label: "Inseam (Crotch to Ankle Length)",
        placeholderText: "Enter crotch to ankle",
        // icon: TbRulerMeasure,
        variant: "number",
      },
    },
    {
      waistToAnkle: {
        label: "Waist to Ankle (Length of Pants)",
        placeholderText: "waist to ankle",
        // icon: TbRulerMeasure,
        variant: "number",
      },
    },
    {
      waistToFloor: {
        label: "Waist to Floor (Length of Dress)",
        placeholderText: "Enter waist to floor",
        // icon: TbRulerMeasure,
        variant: "number",
      },
    },

    {
      ankleSize: {
        label: "Ankle Size (For Shoes)",
        placeholderText: "Enter your ankle size",
        // icon: TbRulerMeasure,
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
        content={`${process.env.S3_PRODUCT_IMAGE_URL}${currentProduct?.images?.[0]?.url}`}
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
        content={`${process.env.ROOT_URL}/product/${currentProduct?.name?.replace(
          /\s+/g,
          "-"
        )}`}
      />
      {/* Mobile title */}
      <h1 className="flex md:hidden">
        {currentProduct ? currentProduct?.name : "...Loading"}
      </h1>
      <div className="flex flex-col-reverse gap-8 md:gap-16 md:flex-row justify-between">
        <div className="flex flex-col gap-4 w-full md:w-3/5">
          {/* Desktop title */}
          <h1 className="hidden md:flex">
            {currentProduct ? currentProduct?.name : "...Loading"}
          </h1>
          <div className="flex flex-col gap-4">
            <p className="whitespace-pre-wrap">{currentProduct?.description}</p>
            <div className="flex items-center justify-between w-full">
              <p className="!font-bold !text-lg">
                Price: £{currentProduct?.price}
              </p>
              <Link
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  `${process.env.ROOT_URL}/product/${currentProduct?.name?.replace(
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
              <Link
                href={`/product/${currentProduct?.name?.replace(
                  /\s+/g,
                  "-"
                )}/orderForm`}
                prefetch
                className="flex items-center gap-2 px-4 py-2 bg-pink-200 rounded-md hover:bg-pink-300 transition-colors duration-300"
              >
                Order
              </Link>
            </div>
            <hr className="mt-4 md:mt-auto" />
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
        <div className="flex flex-col justify-around w-full gap-2 overflow-hidden md:w-3/5 md:h-164 md:flex-row">
          <div className="flex relative w-full h-128 md:h-auto md:w-7/8">
            <img
              src={`${process.env.S3_PRODUCT_IMAGE_URL}${selectedImageUrl ?? currentProduct?.images?.[0]?.url}`}
              alt={currentProduct?.name}
              className="flex w-full object-cover grow-0 shrink-0"
            />
            {isAdmin && (
              <Link
                prefetch
                href={`/admin/product/${currentProduct?.id}`}
                className="flex p-3 border-1 self-end rounded-full bg-pink-200 opacity-60 absolute bottom-2 right-2 hover:opacity-90  hover:bg-pink-200 duration-300 transition-all"
                aria-label="Edit Product"
              >
                <FiEdit />
              </Link>
            )}
          </div>
          <div className="flex w-full shrink-0 gap-1 overflow-scroll h-32 md:h-full md:flex-col md:w-1/8">
            {currentProduct?.images?.map((image) => {
              return (
                <img
                  key={image?.url}
                  src={`${process.env.S3_PRODUCT_IMAGE_URL}${image?.url}`}
                  alt={image?.altText || currentProduct?.name}
                  className="border-1 object-fit border-pink-100 p-1  cursor-pointer  hover:border-pink-200 hover:shadow-lg transition-all duration-300 rounded-sm flex-shrink-0"
                  onClick={() => setSelectedImageUrl(image?.url || null)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductPage;
