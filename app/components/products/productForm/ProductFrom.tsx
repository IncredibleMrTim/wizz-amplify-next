"use client";

import { Input } from "@/components/shad/input";
import { Textarea } from "@/components/shad/textarea";

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
import { FileUploader } from "@aws-amplify/ui-react-storage";
import { type Schema } from "amplify/data/resource";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams } from "next/navigation";
import { ScrollView, ThemeProvider } from "@aws-amplify/ui-react";
import { useAppDispatch, useAppSelector, STORE_PATHS } from "@/stores/store";
import { FiX } from "react-icons/fi";

interface ProductFormProps {
  onSubmit: (product: Schema["Product"]["type"]) => void;
}

const theme = {
  name: "my-theme",
  tokens: {
    components: {
      fileuploader: {
        previewer: {
          display: "flex",
        },
      },
    },
  },
};

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
  const params = useParams();
  const dispatch = useAppDispatch();
  const productData = useAppSelector((state) => state.products.currentProduct);
  const allProducts = useAppSelector((state) => state.products.allProducts);

  const [product, setProduct] = useState<Schema["Product"]["type"] | null>(
    null
  );

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

  const { reset: resetForm } = form;

  useEffect(() => {
    if (productData) {
      const fetchProduct = async () => {
        if (productData) {
          resetForm(productData as z.infer<typeof formSchema>);
          setProduct(productData);
        } else {
          console.error("Invalid product ID:", params.productId);
        }
      };

      fetchProduct();
    }
  }, [productData]);

  useEffect(() => {
    // If the product is not set, reset the form
    console.log("ProductForm useEffect - product:", product);
    console.log(
      "p",
      product?.images?.map((img) => ({
        key: img!.url?.replace("public/", "") as string,
      })) || []
    );
  }, [product]);

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

      setProduct(null);
      form.reset();

      onSubmit(product);
    } else {
      console.error("Product is null and cannot be submitted.");
    }
  };

  useEffect(() => {
    return () => {
      // Clean up function to reset the form and product state
      setProduct(null);
      form.reset();
      dispatch({
        type: STORE_PATHS.SET_CURRENT_PRODUCT,
        payload: null,
      });
    };
  }, []);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col gap-6  p-4 bg-gray-50">
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
                      <div className="flex justify-between gap-4 w-full">
                        <FileUploader
                          acceptedFileTypes={["image/*"]}
                          path={`${process.env.AWS_S3_PRODUCT_IMAGE_PATH!}`}
                          maxFileCount={10}
                          isResumable
                          defaultFiles={
                            product?.images?.map((img) => {
                              console.log("img url", img?.url);
                              return {
                                key: img!.url?.replace("public/", "") as string,
                              };
                            }) || []
                          }
                          maxFileSize={2000000}
                          components={{
                            Container({ children }) {
                              return (
                                <div className="flex flex-row gap-2 w-full">
                                  {children}
                                </div>
                              );
                            },
                            DropZone({ children }) {
                              return (
                                <div className="flex flex-col gap-2 w-1/2">
                                  <div className="flex flex-col gap-4 justify-center items-center border-2 border-dashed border-gray-300 rounded-md h-64 bg-white">
                                    {children}
                                    <p className="text-sm text-gray-500">
                                      Drag and drop files here, or click to
                                      select files.
                                    </p>
                                  </div>
                                </div>
                              );
                            },
                            FileListHeader({ fileCount }) {
                              return null;
                            },
                            FileList() {
                              return (
                                <div className="flex flex-col gap-2 w-1/2">
                                  <div className="flex flex-wrap gap-2 border-1 border-gray-300 bg-white h-64 p-4 overflow-scroll w-full">
                                    {product?.images?.map((file) => (
                                      <div
                                        key={file?.url}
                                        className="flex flex-col bg-white h-32 w-1/5  justify-center items-center border-1 border-gray-200 p-2 relative"
                                      >
                                        <img
                                          src={`${process.env.AWS_S3_PRODUCT_IMAGE_URL}${file?.url}`}
                                          alt={`${product?.name} product image`}
                                          className="object-cover"
                                        />
                                        <div
                                          className="ml-2 text-gray-300 hover:text-gray-400 !rounded-full !border-1 !absolute !-top-2 !-right-2 bg-white p-1 cursor-pointer"
                                          onClick={() => {
                                            // Remove the image from the product images
                                            setProduct(
                                              (prev) =>
                                                ({
                                                  ...prev,
                                                  images: prev?.images?.filter(
                                                    (img) =>
                                                      img?.url !== file?.url
                                                  ),
                                                }) as unknown as Schema["Product"]["type"]
                                            );
                                          }}
                                        >
                                          <FiX />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            },
                          }}
                          onUploadSuccess={({ key }) => {
                            if (!key) return;
                            console.log("key", key);
                            console.log("Product Images", product?.images);
                            setProduct((prev) => {
                              // ensure there are no duplicates
                              if (
                                prev?.images?.find((img) => {
                                  return img?.url === key;
                                })
                              ) {
                                console.log(
                                  "Image already exists in product images",
                                  prev?.images
                                );
                                return prev;
                              }

                              return {
                                ...prev,
                                images: [...(prev?.images || []), { url: key }],
                              } as unknown as Schema["Product"]["type"];
                            });
                          }}
                        />

                        {/* <div className="w-1/2 border-2 border-gray-200 p-2 rounded-sm">
                          <ScrollView
                            width="100%"
                            height="100%"
                            className="overflow-hidden"
                          >
                            <div className="flex flex-wrap gap-2">
                              {product?.images?.map((img) => (
                                <div className="flex bg-white h-28 w-28 justify-center items-center border-1 border-gray-200">
                                  <img
                                    src={`${process.env.AWS_S3_PRODUCT_IMAGE_URL}${img?.url}`}
                                    key={img?.url}
                                    alt={
                                      img?.altText ||
                                      `${product?.name} product image`
                                    }
                                    className="!h-24"
                                  />
                                  <button
                                    className=""
                                    onClick={() => {
                                      setProduct(
                                        (prev) =>
                                          ({
                                            ...prev,
                                            images: prev?.images?.filter(
                                              (image) => image?.url !== img?.url
                                            ),
                                          }) as unknown as Schema["Product"]["type"]
                                      );
                                    }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              ))}
                            </div>
                          </ScrollView>
                        </div> */}
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit" variant="solid">
              {params.productId ? "Update" : "Create"} Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
