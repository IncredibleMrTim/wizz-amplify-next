"use client";
import { useState, useEffect, useMemo } from "react";
import { useAppSelector, useAppDispatch, STORE_PATHS } from "@/stores/store";
import { useGetProductQuery } from "@/services/product/useGetProductQuery";
import { Schema } from "amplify/data/resource";
import { useParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shad/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TbRulerMeasure } from "react-icons/tb";
import { FiCalendar } from "react-icons/fi";
import { PiBasket } from "react-icons/pi";
import { HiShare } from "react-icons/hi2";
import { nullable, z } from "zod";
import { Textarea } from "@/components/shad/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

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
  // .or(z.literal("")),

  deliveryDate: z.date(),
});

const ProductPage = () => {
  const params = useParams();
  const [product, setProduct] = useState<Schema["Product"]["type"] | null>(
    null
  );
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
                  Share on Whatsapp:
                  <HiShare size={20} />
                </Link>
              </div>
              <hr />
            </div>
          </div>
          <div>
            <Form {...form}>
              <form className="flex flex-col gap-4 items-start">
                <div className="flex gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="chestSize"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col items-start w-1/2">
                          {/* <FormLabel>Chest Size:</FormLabel> */}
                          <FormControl className="relative">
                            <div className="relative w-full">
                              <TbRulerMeasure
                                size={20}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              />
                              <Input
                                type="number"
                                placeholder="Chest Size"
                                {...field}
                                className="w-full !border-0 shadow-none !border-b-1 rounded-none border-b-gray-300 focus-visible:ring-transparent"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="waistSize"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col items-start w-1/2">
                          <FormControl>
                            <div className="relative w-full">
                              <TbRulerMeasure
                                size={20}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              />
                              <Input
                                type="number"
                                placeholder="Waist Size"
                                {...field}
                                className="w-full !border-0 shadow-none !border-b-1 rounded-none border-b-gray-300 focus-visible:ring-transparent"
                              />
                            </div>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="flex gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col items-start w-1/2">
                          <FormControl>
                            <div className="relative w-full">
                              <PiBasket
                                size={20}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              />
                              <Input
                                type="number"
                                placeholder="Quantity"
                                {...field}
                                className="w-full !border-0 shadow-none !border-b-1 rounded-none border-b-gray-300 focus-visible:ring-transparent"
                                onChange={(e) => {
                                  const value = parseInt(e.target.value, 10);
                                  if (!isNaN(value)) {
                                    console.log("Setting quantity:", value);
                                    form.setValue("quantity", value, {
                                      shouldValidate: true,
                                    });
                                  } else {
                                    form.setValue("quantity", "", {
                                      shouldValidate: false,
                                    });
                                  }
                                }}
                              />
                            </div>
                          </FormControl>
                          <FormMessage className="text-red-500 text-sm mt-1" />
                        </FormItem>
                      );
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col items-start w-1/2">
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <div className="relative w-full">
                                  <FiCalendar
                                    size={20}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                  />
                                  <Input
                                    type="text"
                                    placeholder="Suggested Delivery Date"
                                    value={
                                      (field?.value &&
                                        new Date(
                                          field?.value
                                        ).toLocaleDateString()) ||
                                      ""
                                    }
                                    readOnly
                                    className="w-full !border-0 shadow-none !border-b-1 rounded-none border-b-gray-300 focus-visible:ring-transparent"
                                  />
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-white">
                                <Calendar
                                  fromDate={defaultDate()}
                                  initialFocus={true}
                                  selected={
                                    field.value ? new Date() : undefined
                                  }
                                  mode="single"
                                  onSelect={(date, day, mod, e) => {
                                    if (date) {
                                      field.onChange(date);
                                      form.setValue("deliveryDate", date, {
                                        shouldValidate: true,
                                      });
                                    }
                                  }}
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="flex gap-4 w-full">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => {
                      return (
                        <FormItem className="flex flex-col items-start w-full">
                          <FormLabel>Additional Information:</FormLabel>
                          <FormControl>
                            <Textarea
                              maxLength={1000}
                              placeholder="Describe any additional information you would like to provide"
                              {...field}
                              className="w-full h-32 border-gray-300 focus-visible:ring-transparent shadow-none"
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
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
