"use client";

import { Input } from "@/components/shad/input";
import { Textarea } from "@/components/shad/textarea";
import { Button } from "@/components/shad/button";

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
import { getUserCredentials } from "@/services/users";
import { AuthSession } from "aws-amplify/auth";
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

  useEffect(() => {
    const fetchUserCredentials = async () => {
      const { credentials, user, attrs } = await getUserCredentials();
      setCreds(credentials);
    };

    fetchUserCredentials();
  }, []);

  useEffect(() => {
    console.log("Product state changed:", product);
  }, [product]);

  const form = useForm<
    z.infer<typeof formSchema>,
    any,
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
      imageUrl: "",
      isFeatured: false,
    },
  });

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
          <div className="flex flex-col gap-4">
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
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
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
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
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
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
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
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
            <div className="bg-gray-100 p-4 rounded-md shadow-md">
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
                          console.log(e);
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

            <div className="bg-gray-100 p-4 rounded-md shadow-md">
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image</FormLabel>
                    <FormDescription>Upload a product image.</FormDescription>
                    <FormControl>
                      <div>
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
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="mt-2">
              Add Product
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default AddProduct;
