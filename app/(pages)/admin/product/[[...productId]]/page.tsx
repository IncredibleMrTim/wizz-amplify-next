"use client";
import { type Schema } from "amplify/data/resource";
import { useAddProductMutation } from "@/services/product/useAddProductMutation";
import { useUpdateProductMutation } from "@/services/product/useUpdateProductMutation";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { ProductForm } from "@/components/products/productForm/ProductFrom";

const AdminProductsPage = () => {
  const addProductMutation = useAddProductMutation();
  const updateProductMutation = useUpdateProductMutation();
  const router = useRouter();
  const params = useParams();

  const handleSubmit = (p: Schema["Product"]["type"]) => {
    console.log("p", p);
    if (params.productId) {
      updateProductMutation.mutateAsync(p);
    } else {
      addProductMutation.mutateAsync(p);
    }
    router.push("/admin");
  };

  return <ProductForm onSubmit={(p) => handleSubmit(p)} />;
};
export default AdminProductsPage;
