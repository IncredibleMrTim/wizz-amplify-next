"use client";
import Navigation from "@/components/navigation/Navigation";
import { useRouter } from "next/navigation";
import { BreadCrumb } from "../breadCrumb/BreadCrumb";

const Header = () => {
  const router = useRouter();
  return (
    <div>
      <header className="h-48 relative">
        <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-r from-transparent from-40% to-black to-100%">
          <img
            src="header-model.jpg"
            alt="Header Model"
            className="background-image w-full h-full object-cover opacity-50"
          />
          <img
            src="wizz-logo-trans.png"
            alt="Wizzington Moos Boutique Logo"
            className="w-96 object-right absolute top-0 right-0 mt-4 mr-4"
            onClick={() => router.push("/")}
          />
        </div>
      </header>
      <div className="w-full border-b border-gray-300 h-10">
        <Navigation />
      </div>
      <BreadCrumb />
    </div>
  );
};
export default Header;
