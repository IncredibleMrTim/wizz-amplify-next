"use client";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/stores/store";
import { BreadCrumb } from "./BreadCrumb";

export default () => {
  // get pathname and product from the store
  const product = useAppSelector((state) => state.products.currentProduct);
  const pathname = usePathname();

  // get the segments of the path
  const hiddenSegments = ["admin", "basket"];

  // filter out empty segments and hidden segments
  const segments = pathname
    .split("/")
    .filter((segment) => segment !== "" && !hiddenSegments.includes(segment));

  return (
    <BreadCrumb pathname={pathname} product={product} segments={segments} />
  );
};
