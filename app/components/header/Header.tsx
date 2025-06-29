"use client";
import Navigation from "@/components/navigation/Navigation";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FiMenu } from "react-icons/fi";
import { Drawer } from "../drawer/Drawer";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <>
      <header className="h-48">
        <div
          className="flex h-48 bg-no-repeat bg-cover"
          style={{
            backgroundImage:
              "linear-gradient(to right, transparent 30%, #00000075 100%), url('/header-model.jpg')",
            backgroundPosition: "30%",
          }}
        >
          <div className="w-full flex justify-center md:justify-end p-4">
            <img
              src="/wizz-logo-trans-v2-flare-stroke.webp"
              alt="Wizzington Moos Boutique Logo"
              onClick={() => router.push("/")}
            />
          </div>
        </div>
      </header>
      <div className="hidden w-full border-b border-gray-300 h-10 sho md:flex">
        <Navigation />
      </div>
      <div className="flex w-full visible md:hidden">
        <Drawer />
      </div>
    </>
  );
};
export default Header;
