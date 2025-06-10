"use client";

import { Input } from "@/components/shad/input";
import { Textarea } from "@/components/shad/textarea";
import { useRouter } from "next/navigation";
import { Button } from "@radix-ui/themes";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shad/form";
import { type Schema } from "amplify/data/resource";
import { useCallback, useEffect, useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector, STORE_PATHS } from "@/stores/store";
import { FileUploader } from "@/components/fileUploader/FileUploader";
import { useGetProductQuery } from "@/services/product/useGetProductQuery";
import { FiCheck, FiArrowLeft, FiExternalLink } from "react-icons/fi";

interface ProductFormProps {
  onSubmit: (product: Schema["Product"]["type"]) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  imageUrl: z.string().optional(),
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
  isFeatured: z.boolean(),
});

export const ProductForm = ({ onSubmit }: ProductFormProps) => {
  const { getProductById } = useGetProductQuery();
  const params = useParams();
  const dispatch = useAppDispatch();
  const allProducts = useAppSelector((state) => state.products.allProducts);
  const productImagesRef = useRef<Schema["Product"]["type"]["images"]>([]);

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
    defaultValues: {
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || 0,
      stock: product?.stock || 0,
      isFeatured: product?.isFeatured || false,
    },
  });

  useEffect(() => {
    if (!data) return;

    setProduct(data as Schema["Product"]["type"]);
    form.reset(data as z.infer<typeof formSchema>);
    dispatch({
      type: STORE_PATHS.SET_CURRENT_PRODUCT,
      payload: data as Schema["Product"]["type"],
    });

    return () => {
      // Clean up function to reset the form and product state
      setProduct(null);
      form.reset();
      dispatch({
        type: STORE_PATHS.SET_CURRENT_PRODUCT,
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

  const handleSubmit = () => {
    if (product) {
      // if a new product, add it to te product list
      if (!product.id) {
        dispatch({
          type: STORE_PATHS.SET_PRODUCTS,
          payload: [...allProducts, product],
        });
      } else {
        // if an existing product, update it in the product list
        const updatedProducts = allProducts.map((p) =>
          p.id === product.id ? product : p
        );
        dispatch({
          type: STORE_PATHS.SET_PRODUCTS,
          payload: updatedProducts,
        });
      }

      onSubmit(product);
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

  const formRef = useRef<HTMLFormElement>(null);
  return (
    <div className="-mt-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} ref={formRef}>
          <div className="flex flex-col gap-6  p-4 bg-gray-100 rounded-md">
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
                              ...product,
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
                              ...product,
                              description: e.target.value,
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
                          onBlur={(e) =>
                            setProduct({
                              ...product,
                              price: e.target.valueAsNumber,
                            } as unknown as Schema["Product"]["type"])
                          }
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
                              ...product,
                              stock: e.target.valueAsNumber,
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
            <div>
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Feature Product</FormLabel>
                    <FormDescription>
                      Marking a product as Featured will display it on the home
                      page
                    </FormDescription>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <p>Check this box to feature the product.</p>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => {
                            field.onChange(e);
                            setProduct({
                              ...product,
                              isFeatured: e.target.checked,
                            } as unknown as Schema["Product"]["type"]);
                          }}
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
            </div>

            <div>
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xl">Product Images</FormLabel>
                    <FormDescription>
                      Upload product images. You can upload a maximum of 10
                      images
                    </FormDescription>
                    <FormControl>
                      <div key={product?.id}>
                        {/* FileUploader component for uploading images */}
                        <FileUploader
                          product={product!}
                          imagesRef={productImagesRef}
                          updateProductImages={updateProductImages}
                          updateProductImageOrder={updateProductImageOrder}
                        />
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-between gap-2 pt-4">
            <Button
              variant="outline"
              className="!mb-4"
              onClick={() => router.push("/admin")}
            >
              <FiArrowLeft size={16} />
              Cancel
            </Button>

            <Button type="submit" variant="solid">
              <FiCheck size={16} />
              {params.productId?.[0] ? "Update" : "Create"} Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
