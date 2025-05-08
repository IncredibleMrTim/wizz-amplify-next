"use client";
import { type Schema } from "amplify/data/resource";
import AddProduct from "@/components/products/product/Product";
import { addProduct, updateProduct } from "@/services/products";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

const AdminProductsPage = () => {
  const router = useRouter();
  const params = useParams();

  const handleSubmit = (p: Schema["Product"]["type"]) => {
    if (params.productId) {
      updateProduct(p);
    } else {
      addProduct(p);
    }
    router.push("/admin");
  };

  return (
    <div>
      <AddProduct onSubmit={(p) => handleSubmit(p)} />
    </div>
  );
};
export default AdminProductsPage;
