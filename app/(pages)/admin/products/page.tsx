"use client";

import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import AddProduct from "@/app/components/products/addProduct/AddProduct";
import { addProduct } from "@/app/services/products";

const AdminProductsPage = () => {
  return (
    <div>
      <AddProduct onSubmit={addProduct} />
    </div>
  );
};
export default AdminProductsPage;
