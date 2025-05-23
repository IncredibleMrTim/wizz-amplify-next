"use client";
import { usePathname, useParams } from "next/navigation";

export const segmentMappings: { [key: string]: string } = {
  admin: "Admin Home",
  product: "Product",
};

export const isActiveBreadcrumb = (segment: string, productId?: string) => {
  console.log("segment", segment);
  console.log("productId", productId);
  console.log("pathName", usePathname());
  return (
    (segment !== "admin" && !usePathname().includes(segment || "")) ||
    productId === undefined
  );
};
