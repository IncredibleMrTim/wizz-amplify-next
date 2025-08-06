"use client";

import { Schema } from "amplify/data/resource";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiArrowLeft, FiCheck } from "react-icons/fi";
import { z } from "zod";

import { FileUploader } from "@/components/fileUploader/FileUploader";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAddProductMutation } from "@/services/product/useAddProductMutation";
import { useGetProductQuery } from "@/services/product/useGetProductQuery";
import { useUpdateProductMutation } from "@/services/product/useUpdateProductMutation";
import { STORE_KEYS, useAppDispatch, useAppSelector } from "@/stores/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .optional(),
  price: z.coerce
    .number()
    .min(0, { message: "Price must be a positive number" })
    .max(10000, { message: "Price must be less than 10000" })
    .optional(),
  stock: z.coerce
    .number()
    .min(0, { message: "Stock must be a positive number" })
    .max(10000, { message: "Stock must be less than 10000" })
    .optional(),
  isFeatured: z.boolean().optional(),
  isEnquiryOnly: z.boolean().optional(),
  id: z.string().optional(),
});

export const ProductEditor = () => {
  const { getProductById } = useGetProductQuery();
  const params = useParams();
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector((state) => state.products.allProducts);
  const productImagesRef = useRef<Schema["Product"]["type"]["images"]>([]);
  const addProductMutation = useAddProductMutation();
  const updateProductMutation = useUpdateProductMutation();

  const [product, setProduct] = useState<Schema["Product"]["type"] | null>(
    null
  );
  const router = useRouter();

  const data = params?.productId?.[0]
    ? getProductById(params?.productId?.[0]).data
    : null;

  const form = useForm<
    z.infer<typeof formSchema>,
    any,
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    values: {
      id: product?.id || "",
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price ?? 0,
      stock: product?.stock ?? 0,
      isFeatured: product?.isFeatured ?? false,
      isEnquiryOnly: product?.isEnquiryOnly ?? false,
    },
  });

  useEffect(() => {
    if (!data) return;

    setProduct(data as Schema["Product"]["type"]);
    form.reset(data as z.infer<typeof formSchema>);
    dispatch({
      type: STORE_KEYS.SET_CURRENT_PRODUCT,
      payload: data as Schema["Product"]["type"],
    });

    return () => {
      // Clean up function to reset the form and product state
      setProduct(null);
      form.reset();
      dispatch({
        type: STORE_KEYS.SET_CURRENT_PRODUCT,
        payload: null,
      });
    };
  }, [data]);

  // update the imagesRef when product images change
  // this is used so that we always have an upto date reference to the images
  // when the FileUploader component is used
  useEffect(() => {
    productImagesRef.current = product?.images || [];
  }, [product?.images]);

  const handleSubmit = async () => {
    if (product) {
      if (product.id) {
        updateProductMutation.mutateAsync({
          ...form.getValues(),
          createdAt: product.createdAt,
          updatedAt: new Date().toISOString(),
        } as Schema["Product"]["type"]);

        // if an existing product, update it in the product list
        const updatedProducts = allProducts.map((p) =>
          p.id === product.id ? product : p
        );
        dispatch({
          type: STORE_KEYS.SET_PRODUCTS,
          payload: updatedProducts,
        });
      } else {
        const newProduct = await addProductMutation.mutateAsync(product);

        dispatch({
          type: STORE_KEYS.SET_PRODUCTS,
          payload: [...allProducts, newProduct],
        });
      }
      router.push("/admin");
    } else {
      console.error("Product is null and cannot be submitted.");
    }
  };

  const updateProductImages = (images: Schema["Product"]["type"]["images"]) => {
    setProduct((prev) => {
      return {
        ...prev,
        images: images,
      } as unknown as Schema["Product"]["type"];
    });
  };

  const updateProductImageOrder = useCallback(
    (key: string, orderPosition: number) => {
      setProduct((prev) => {
        if (!prev || !Array.isArray(prev.images)) return prev;

        const images = [...prev.images];

        const imageIndex = images.findIndex((img) => img?.url === key);

        const currentImage = images[imageIndex];

        images.splice(imageIndex, 1);
        if (currentImage?.url) {
          images.splice(orderPosition, 0, {
            ...currentImage,
            order: orderPosition,
            url: currentImage.url,
          });
        }

        const orderedImages = images.map((img, index) => ({
          ...img,
          order: index,
        }));

        return {
          ...prev,
          images: orderedImages,
        } as unknown as Schema["Product"]["type"];
      });
    },
    [setProduct]
  );

  return (
    <div className="-mt-8 bg-violet-50 p-4   shadow-sm shadow-gray-300 border-gray-200">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col gap-6">
            <div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormDescription>
                      Enter the name of the product.
                    </FormDescription>
                    <FormControl>
                      <div className="bg-white">
                        <Input
                          {...field}
                          type="text"
                          placeholder="Product Name"
                          onBlur={(e) =>
                            setProduct({
                              ...form.getValues(),
                              name: e.target.value,
                            } as Schema["Product"]["type"])
                          }
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Description</FormLabel>
                    <FormDescription>
                      Enter the product description.
                    </FormDescription>
                    <FormControl>
                      <div className="bg-white">
                        <Textarea
                          {...field}
                          placeholder="Product Description"
                          onBlur={(e) =>
                            setProduct({
                              ...form.getValues(),
                              description: e.target.value,
                            } as unknown as Schema["Product"]["type"])
                          }
                          className="border-0 border-b-1 border-gray-300 rounded-none focus:!ring-0"
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row gap-4 justify-between">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="text-xl">Price</FormLabel>
                    <FormDescription>
                      Enter the product price (£).
                    </FormDescription>
                    <FormControl>
                      <div className="bg-white">
                        <Input
                          {...field}
                          type="number"
                          placeholder="Price"
                          onBlur={(e) => {
                            setProduct({
                              ...form.getValues(),
                              price: isNaN(e.target.valueAsNumber)
                                ? 0
                                : e.target.valueAsNumber,
                            } as unknown as Schema["Product"]["type"]);
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel className="text-xl">Stock Level</FormLabel>
                    <FormDescription>
                      Enter the product stock level
                    </FormDescription>
                    <FormControl>
                      <div className="bg-white">
                        <Input
                          {...field}
                          type="number"
                          placeholder="Stock"
                          onBlur={(e) =>
                            setProduct({
                              ...form.getValues(),
                              stock: isNaN(e.target.valueAsNumber)
                                ? 0
                                : e.target.valueAsNumber,
                            } as unknown as Schema["Product"]["type"])
                          }
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-4">
              <div className="w-[50%]">
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl">
                        Product Category
                      </FormLabel>
                      <FormDescription>
                        Marking a product as Featured will display it on the
                        home page
                      </FormDescription>
                      <FormControl className="w-full">
                        <div className="flex gap-2 w-container relative">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                              className="!ring-0 bg-white w-full"
                            >
                              <Button
                                variant="outline"
                                className="w-full justify-end"
                              >
                                {field.value ?? "Select stock level"}
                                <ChevronDown className="ml-2 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className=" bg-white w-full">
                              <DropdownMenuItem
                                onClick={() => {
                                  field.onChange(0);
                                  setProduct({
                                    ...form.getValues(),
                                    stock: 0,
                                  } as unknown as Schema["Product"]["type"]);
                                }}
                                className="w-full"
                              >
                                In Stock
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  field.onChange(1);
                                  setProduct({
                                    ...form.getValues(),
                                    stock: 1,
                                  } as unknown as Schema["Product"]["type"]);
                                }}
                              >
                                Out of Stock
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-[50%]">
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl">Feature Product</FormLabel>
                      <FormDescription>
                        Marking a product as Featured will display it on the
                        home page
                      </FormDescription>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <p>Check this box to feature the product.</p>
                          <Checkbox
                            checked={field.value ?? false}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              setProduct({
                                ...form.getValues(),
                                isFeatured: checked,
                              } as unknown as Schema["Product"]["type"]);
                            }}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            disabled={field.disabled}
                            className={`h-4 w-4 bg-white border-gray-500 ${field.value === true ? "bg-pink-500 border-pink-500 text-white" : ""}`}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-[50%]">
                <FormField
                  control={form.control}
                  name="isEnquiryOnly"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xl">Enquiry Only</FormLabel>
                      <FormDescription>
                        Marking this product as Enquiry Only will hide the
                        payment methods and only allow the user to send an
                        enquiry email
                      </FormDescription>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <p>
                            Check this box to mark the product as Enquiry Only.
                          </p>
                          <Checkbox
                            checked={field.value ?? false}
                            onCheckedChange={(checked) => {
                              field.onChange(checked);
                              setProduct({
                                ...form.getValues(),
                                isEnquiryOnly: checked,
                              } as unknown as Schema["Product"]["type"]);
                            }}
                            className={`h-4 w-4 bg-white border-gray-500 ${field.value === true ? "bg-pink-500 border-pink-500 text-white" : ""}`}
                            name={field.name}
                            ref={field.ref}
                            onBlur={field.onBlur}
                            disabled={field.disabled}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <div key={product?.id}>
                {/* FileUploader component for uploading images */}
                <FileUploader
                  product={product!}
                  imagesRef={productImagesRef}
                  updateProductImages={updateProductImages}
                  updateProductImageOrder={updateProductImageOrder}
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between gap-2 pt-4">
            <Button variant="outline" onClick={() => router.push("/admin")}>
              <FiArrowLeft />
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting || !form.formState.isValid}
              className="flex items-center gap-2"
            >
              <FiCheck />
              {params.productId?.[0] ? "Update" : "Create"} Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
