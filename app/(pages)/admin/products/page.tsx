"use client";
import { type Schema } from "amplify/data/resource";
import AddProduct from "@/components/products/addProduct/AddProduct";
import { addProduct } from "@/services/products";
import { useRouter } from "next/navigation";

const AdminProductsPage = () => {
  const router = useRouter();
  const handleSubmit = (p: Schema["Product"]["type"]) => {
    addProduct(p);
    router.push("/admin");
  };

  return (
    <div>
      <AddProduct onSubmit={(p) => handleSubmit(p)} />
    </div>
  );
};
export default AdminProductsPage;
