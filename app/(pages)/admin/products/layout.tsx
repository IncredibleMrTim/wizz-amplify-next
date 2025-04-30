const AdminProductsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <h1 className="text-2xl">Admin Products</h1>
      </header>
      <main className="flex-grow p-4">{children}</main>
      <footer className="bg-gray-800 text-white p-4 text-center">
        &copy; 2023 My Admin Products
      </footer>
    </div>
  );
};
export default AdminProductsLayout;
