import { useAppSelector } from "@/stores/store";
import adminComponents from "../navigation/adminComponents";
import userComponents from "../navigation/userComponents";
import Link from "next/link";
import { Separator } from "../separator/Separator";
import { FiChevronsRight } from "react-icons/fi";
import { useAppDispatch, STORE_PATHS } from "@/stores/store";

interface DrawerTemplateProps {
  type?: "user" | "admin";
}

export const DrawerTemplate = ({ type }: DrawerTemplateProps) => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const components = type === "admin" ? adminComponents : userComponents;
  const dispatch = useAppDispatch();

  return (
    <div className="bg-gray-800 h-full w-full rounded-md bg-gradient-to-t from-gray-300 from-1% to-transparent to-80%">
      <div className="w-full flex justify-end p-2 mb-4  pt-6 pr-6">
        <img src="./wizz-logo-trans.webp" className="w-1/2" />
        <div className="fixed top-0 left-0 p-2">
          <FiChevronsRight
            size={24}
            className="text-gray-500 cursor-pointer"
            onClick={() => {
              dispatch({
                type: STORE_PATHS.SET_DRAWER_IS_OPEN,
                payload: false,
              });
            }}
          />
        </div>
      </div>

      <div className="p-4">
        <ul>
          {components &&
            components.map((component, i) => (
              <li key={component.id} className="">
                <Link href={component.href} className="text-lg text-gray-100 ">
                  {component.title}
                </Link>
                <Separator />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
