import getProducts from "@/services/products";

const ProductList = () => {
  const products = getProducts();
  console.log(products);
  return (
    <div>
      <h1>Product List</h1>
    </div>
  );
};
export default ProductList;
