"use client";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/stores/store";
import { BreadCrumb } from "./BreadCrumb";

export default () => {
  const product = useAppSelector((state) => state.products.currentProduct);

  const pathname = usePathname();
  console.log(pathname);
  // get the segments of the path
  // filter out empty segments and hidden segments
  const segments = pathname.split("/").filter((segment) => segment !== "");

  const hiddenSegments = ["admin", "basket"];
  const filteredSegments = segments.filter(
    (segment) => !hiddenSegments.includes(segment)
  );

  return (
    <BreadCrumb
      pathname={pathname}
      product={product}
      segments={filteredSegments}
    />
  );
};
