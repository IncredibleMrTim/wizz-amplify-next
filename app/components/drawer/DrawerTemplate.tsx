import { useAppSelector } from "@/stores/store";
import adminComponents from "../navigation/adminComponents";
import userComponents from "../navigation/userComponents";
import Link from "next/link";
import { Separator } from "../separator/Separator";
import { FiChevronsRight } from "react-icons/fi";
import { useAppDispatch, STORE_KEYS } from "@/stores/store";
import { Avatar } from "@aws-amplify/ui-react";

interface DrawerTemplateProps {
  type?: "user" | "admin";
}

export const DrawerTemplate = ({ type }: DrawerTemplateProps) => {
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const components = type === "admin" ? adminComponents : userComponents;
  const dispatch = useAppDispatch();

  return (
    <div className="bg-white h-full w-full rounded-md bg-gradient-to-tr from-gray-300 from-20% to-transparent to-100%">
      <div className="w-full flex justify-end p-2 mb-4 pt-6 pr-6">
        <img src="/wizz-logo-trans-v2-flare-stroke.webp" className="w-3/8" />
        <div className="fixed top-0 left-0 p-2">
          <FiChevronsRight
            size={24}
            className="text-gray-500 cursor-pointer"
            onClick={() => {
              dispatch({
                type: STORE_KEYS.SET_DRAWER_IS_OPEN,
                payload: false,
              });
            }}
          />
        </div>
      </div>

      <div className="px-4 w-full">
        <ul className="w-full">
          {components &&
            components.map((component, i) => (
              <div key={i} className="w-full">
                <li key={component.id} className="py-4 w-full h-full">
                  <Link
                    href={component.href}
                    className="flex text-lg text-gray-700 w-full place-items-center"
                    onClick={() => {
                      dispatch({
                        type: STORE_KEYS.SET_DRAWER_IS_OPEN,
                        payload: false,
                      });
                    }}
                  >
                    {component.title}
                  </Link>
                </li>
                <Separator />
              </div>
            ))}
        </ul>
      </div>

      {currentUser && (
        <>
          <div className="flex flex-col w-full fixed bottom-0 left-0 text-lg text-gray-100 p-4 items-center gap-2">
            <Separator />
            {currentUser && (
              <div className="flex w-full items-center">
                <Avatar>
                  {currentUser?.given_name[0]}
                  {currentUser?.family_name[0]}
                </Avatar>
                <Link
                  href="/admin"
                  onClick={() => {
                    dispatch({
                      type: STORE_KEYS.SET_DRAWER_IS_OPEN,
                      payload: false,
                    });
                  }}
                  className="text-gray-800 ml-2 mt-1"
                >
                  Admin Portal
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
