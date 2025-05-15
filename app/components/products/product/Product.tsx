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
import { FileUploader, StorageImage } from "@aws-amplify/ui-react-storage";

import { type Schema } from "amplify/data/resource";
import { useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getUserCredentials } from "@/services/users";
import { AuthSession } from "aws-amplify/auth";
import { useParams } from "next/navigation";
import { getProduct } from "@/services/products";
import { ScrollView } from "@aws-amplify/ui-react";
interface AddProductProps {
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

const AddProduct = ({ onSubmit }: AddProductProps) => {
  const [product, setProduct] = useState<Schema["Product"]["type"] | null>(
    null
  );
  const [creds, setCreds] = useState<AuthSession | null>(null);

  const params = useParams();

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
      imageUrl: product?.imageUrl || "",
      isFeatured: product?.isFeatured || false,
    },
  });

  const { reset } = form;

  useEffect(() => {
    const fetchUserCredentials = async () => {
      const { credentials, user, attrs } = await getUserCredentials();
      setCreds(credentials);
    };

    fetchUserCredentials();

    if (params.productId) {
      const fetchProduct = async () => {
        if (params.productId) {
          const fetchedProduct = await getProduct(
            params.productId[0] as string
          );
          reset({
            name: fetchedProduct?.name || "",
            description: fetchedProduct?.description || "",
            price: fetchedProduct?.price || 0,
            stock: fetchedProduct?.stock || 0,
            imageUrl: fetchedProduct?.imageUrl || "",
            isFeatured: fetchedProduct?.isFeatured || false,
          });
          setProduct(fetchedProduct);
        } else {
          console.error("Invalid product ID:", params.productId);
        }
      };

      fetchProduct();
    }
  }, []);

  const handleSubmit = () => {
    if (product) {
      onSubmit(product);
    } else {
      console.error("Product is null and cannot be submitted.");
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded-md shadow-md">
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
                    <FormLabel>Description</FormLabel>
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
            <div>
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormDescription>Enter the product price.</FormDescription>
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
            </div>
            <div>
              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stock Level</FormLabel>
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
                    <FormLabel>Feature Product</FormLabel>
                    <FormDescription>
                      Check this box to feature the product.
                    </FormDescription>
                    <FormControl>
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
                      />
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
                    <FormLabel>Image</FormLabel>
                    <FormDescription>Upload a product image.</FormDescription>
                    <FormControl>
                      <div className="flex justify-between gap-4">
                        <div className="w-1/2">
                          <FileUploader
                            acceptedFileTypes={["image/*"]}
                            path={`${process.env.AWS_S3_PRODUCT_IMAGE_PATH!}`}
                            maxFileCount={1}
                            isResumable
                            showThumbnails
                            onUploadSuccess={({ key }) => {
                              if (!key) return;
                              setProduct({
                                ...product,
                                imageUrl: key,
                              } as unknown as Schema["Product"]["type"]);
                            }}
                          />
                          <Input
                            hidden
                            readOnly
                            {...field}
                            placeholder="Stock"
                            value={product?.imageUrl || ""}
                          />
                        </div>
                        <div className="w-1/2 border-2 border-gray-200 p-2 rounded-sm">
                          <ScrollView
                            width="100%"
                            height="100%"
                            className="overflow-hidden"
                          >
                            {product?.imageUrl && (
                              <div className="flex bg-white h-28 w-28 justify-center items-center border-1 border-gray-200">
                                <StorageImage
                                  path={`${product.imageUrl}`}
                                  alt="Product"
                                  className="!h-24"
                                />
                              </div>
                            )}
                          </ScrollView>
                        </div>
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
export default AddProduct;
