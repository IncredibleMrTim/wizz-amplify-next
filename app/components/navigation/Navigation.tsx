"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/stores/store";
import { AuthUserMenu } from "../auth/authUserMenu/AuthUserMenu";
import adminComponents from "./adminComponents";
import userComponents from "./userComponents";
import { Button, IconButton } from "@radix-ui/themes";
import { Avatar } from "@aws-amplify/ui-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { FiPlus } from "react-icons/fi";
import { CgShoppingCart } from "react-icons/cg";

export type NavComponent = {
  id: string;
  type: "button" | "link";
  title: string;
  href: string;
  content?: string | React.ReactNode;
  icon?: React.ReactNode;
};

interface NavigationProps {
  type?: "user" | "admin";
}

const Navigation = ({ type = "user" }: NavigationProps) => {
  const [selected, setSelected] = useState<NavComponent | null>(null);
  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const components = type === "admin" ? adminComponents : userComponents;

  const handleAdminMenuItemClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    setAdminMenuOpen(false);
  };

  return (
    <div>
      <div
        className={` w-full bg-white box-border z-1 ${type === "user" && "absolute  shadow-md"} ${selected && "h-auto"} `}
        onMouseLeave={() => {
          setSelected(null);
        }}
      >
        <ul className="flex gap-4 bg-white">
          {components &&
            components.map((component) => (
              <li
                className={`${type === "user" && "first:ml-4 h-10"}  ${selected?.id === component.id && type === "user" && "border-b-2 border-gray-400"}`}
                key={component.id}
              >
                {component.type === "link" ? (
                  <div
                    className={`cursor-pointer py-2`}
                    onMouseEnter={() => {
                      setSelected(component);
                    }}
                  >
                    {component.title}
                  </div>
                ) : (
                  <Link href={component.href} prefetch>
                    <Button variant="solid" className="px-2 py-2">
                      <FiPlus /> {component.title}
                    </Button>
                  </Link>
                )}
              </li>
            ))}
        </ul>
        <div className="flex absolute top-0 right-0 h-10 mr-4 items-center gap-2">
          <Link
            href="/basket"
            className="flex items-center rounded-full  p-2 bg-gray-100"
          >
            <CgShoppingCart size={18} />
          </Link>
          {type === "user" && (
            <>
              {currentUser ? (
                <Popover onOpenChange={setAdminMenuOpen} open={adminMenuOpen}>
                  <PopoverTrigger>
                    <Avatar>
                      {currentUser?.given_name[0]}
                      {currentUser?.family_name[0]}
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="mr-4 mt-1 bg-white rounded-sm !border-gray-200">
                    <PopoverClose asChild>
                      <AuthUserMenu
                        onMenuItemClick={handleAdminMenuItemClick}
                      />
                    </PopoverClose>
                  </PopoverContent>
                </Popover>
              ) : (
                <Link href="/login">Login</Link>
              )}
            </>
          )}
        </div>
        <div
          className={`overflow-hidden bg-white !z-1 ${selected?.content && "fade-in-scale border-t-1 border-gray-100 "}`}
        >
          {selected?.content}
        </div>
      </div>
    </div>
  );
};
export default Navigation;
