"use client";

import Link from "next/link";
import { useState } from "react";
import { useAppSelector } from "@/stores/redux/store";
import Logout from "../logout/logout";
import adminComponents from "./adminComponents";
import userComponents from "./userComponents";
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

export type NavComponent = {
  id: string;
  type: "button" | "link";
  title: string;
  href: string;
  content?: string | React.ReactNode;
};

interface NavigationProps {
  type?: "user" | "admin";
}

const Navigation = ({ type = "user" }: NavigationProps) => {
  const [selected, setSelected] = useState<NavComponent | null>(null);
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const router = useRouter();
  const components = type === "admin" ? adminComponents : userComponents;

  return (
    <div>
      <div
        className={` w-full bg-white box-border z-100 ${type === "user" && "absolute  shadow-md"} ${selected && "h-auto"} `}
        onMouseLeave={(e) => {
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
                    <Button variant="soft" className="px-2 py-2">
                      {component.title}
                    </Button>
                  </Link>
                )}
              </li>
            ))}
        </ul>
        {type === "user" && (
          <div className="absolute top-0 right-0 px-4 py-2">
            {currentUser ? <Logout /> : <Link href="/admin">Login</Link>}
          </div>
        )}
        <div
          className={`overflow-hidden bg-white !z-100 ${selected?.content && "fade-in-scale border-t-1 border-gray-100 "}`}
        >
          {selected?.content}
        </div>
      </div>
    </div>
  );
};
export default Navigation;
