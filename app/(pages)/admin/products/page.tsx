"use client";

import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";
import { useEffect, useState } from "react";
import AddProduct from "@/app/components/products/addProduct/AddProduct";
import { addProduct } from "@/app/services/productAdd";

const AdminProductsPage = () => {
  const client = generateClient<Schema>();
  const [products, setProducts] = useState<Schema["Product"]["type"][] | null>(
    null
  );

  useEffect(() => {
    const subscription = client.models.Product.observeQuery().subscribe({
      next: (data) => {
        console.log("Product data", data);
        setProducts(data.items || null);
      },
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div>
      {/* {products &&
        products.map((product) => (
          <div key={product.id}>
            <h2>{product?.name}</h2>
            <p>{product?.description}</p>
            <p>£{product?.price}</p>
          </div>
        ))} */}

      <AddProduct onSubmit={addProduct} />
    </div>
  );
};
export default AdminProductsPage;
