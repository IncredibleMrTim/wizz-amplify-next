import Navigation from "@/components/navigation/Navigation";
import ProductList from "@/components/products/productList/ProductList";

const AdminPage = async () => {
  return (
    <div>
      <div className="flex justify-start">
        <Navigation type="admin" />
      </div>
      <ProductList />
    </div>
  );
};
export default AdminPage;
