"use client";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Separator } from "@aws-amplify/ui-react-storage/dist/types/components/StorageBrowser/components/base";
import { useState } from "react";

type NavComponent = {
  title: string;
  href: string;
  description: string | React.ReactNode;
};

const components: NavComponent[] = [
  {
    title: "Pageant Wear",
    href: "/docs/primitives/alert-dialog",
    description: (
      <div className="p-4">
        <ul>
          <li>Glitz dresses</li>
          <li>Natural dresses</li>
          <li>Casual wear</li>
          <li>OOC/fun fashion</li>
          <li>Swimwear</li>
          <li>Other</li>
          <li>Accessories</li>
          <li>Gallery</li>
        </ul>
      </div>
    ),
  },
  {
    title: "Dance wear",
    href: "/docs/primitives/hover-card",
    description: (
      <div className="flex p-4 gap-8">
        <div>
          <h2>Figure Skating</h2>
          <ul>
            <li>Lyrical</li>
            <li>Modern</li>
            <li>Jazz</li>
            <li>Tap</li>
            <li>Character inspired</li>
            <li>Acro</li>
            <li>Stretch</li>
            <li>Pancake tutus</li>
            <li>Hand painted</li>
            <li>Airbrush</li>
            <li>Other</li>
            <li>Accessories</li>
            <li>Gallery</li>
          </ul>
        </div>

        <div>
          <h2>Aerial</h2>
          <ul>
            <li>Lyrical</li>
            <li>Modern</li>
            <li>Jazz</li>
            <li>Tap</li>
            <li>Character inspired</li>
            <li>Acro</li>
            <li>Stretch</li>
            <li>Pancake tutus</li>
            <li>Hand painted</li>
            <li>Airbrush</li>
            <li>Other</li>
            <li>Accessories</li>
            <li>Gallery</li>
          </ul>
        </div>
      </div>
    ),
  },
];

const Navigation = () => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [selected, setSelected] = useState<NavComponent | null>(null);

  const NavContent = () => {
    return (
      <div
        className={`absolute bg-white border-b-2 border-gray-100 w-full shadow-md ${isHovered ? "animate-fade-in-scale" : "opacity-0"}`}
      >
        {selected && <div>{selected.description}</div>}
      </div>
    );
  };

  return (
    <div
      className="w-full relative border-b border-gray-200"
      onMouseLeave={() => {
        setSelected(null);
      }}
    >
      <ul className="flex gap-2">
        {components.map((component) => (
          <li>
            <div
              className={`cursor-pointer p-4 ${selected?.title === component.title ? "border-b-2 border-gray-400" : ""}`}
              onMouseEnter={() => {
                setIsHovered(true);
                setSelected(component);
              }}
            >
              {component.title}
            </div>
          </li>
        ))}
      </ul>

      <NavContent />
    </div>
  );
};
export default Navigation;
