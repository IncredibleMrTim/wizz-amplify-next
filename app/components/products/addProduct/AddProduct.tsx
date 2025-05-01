"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploader } from "@aws-amplify/ui-react-storage";
import { type Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import { set, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getUserCredentials } from "@/services/users";
import { AuthSession } from "aws-amplify/auth";
interface AddProductProps {
  onSubmit: (product: Schema["Product"]["type"]) => void;
}

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  image: z.string().optional(),
  description: z.string().min(1, { message: "Description is required" }),
  price: z
    .number()
    .min(0, { message: "Price must be a positive number" })
    .max(10000, { message: "Price must be less than 10000" }),
  stock: z
    .number()
    .min(0, { message: "Stock must be a positive number" })
    .max(10000, { message: "Stock must be less than 10000" }),
});

const AddProduct = ({ onSubmit }: AddProductProps) => {
  const [product, setProduct] = useState<z.infer<typeof formSchema> | null>(
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      stock: 0,
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const newProduct = {
      ...data,
    };
    setProduct(newProduct);
    onSubmit(newProduct as Schema["Product"]["type"]);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Product Name" />
                </FormControl>
                <FormDescription>
                  Enter the name of the product.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Product Description"
                    maxLength={1000}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        description: e.target.value,
                      } as unknown as z.infer<typeof formSchema>)
                    }
                  />
                </FormControl>
                <FormDescription>
                  Enter the product description.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Price"
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        price: parseInt(e.target.value),
                      } as unknown as z.infer<typeof formSchema>)
                    }
                  />
                </FormControl>
                <FormDescription>Enter the product price.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Level</FormLabel>
                <FormControl></FormControl>
                <FormDescription>Enter the product stock level</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <FileUploader
                    acceptedFileTypes={["image/*"]}
                    path={`${process.env.AWS_S3_PRODUCT_IMAGE_PATH!}/${creds?.identityId}/`}
                    maxFileCount={1}
                    bucket={process.env.AWS_S3_PRODUCT_IMAGE_BUCKET!}
                    isResumable
                    showThumbnails
                  />
                </FormControl>
                <FormDescription>Upload a product image.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="mt-2">
            Add Product
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default AddProduct;
