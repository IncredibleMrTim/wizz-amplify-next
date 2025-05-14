"use client";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams, usePathname } from "next/navigation";
import { useAppSelector } from "@/stores/redux/store";
import { segmentMappings, isActiveBreadcrumb } from "@/utils/breadcrumb-utils";

export const BreadCrumb = () => {
  const product = useAppSelector((state) => state.products.currentProduct);
  const { productId } = useParams();
  const segments = usePathname()
    .split("/")
    .filter((item) => item !== "");

  return (
    <div className="flex items-center justify-between text-black p-4">
      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((segment, index) => {
            return (
              <BreadcrumbItem key={index}>
                <Link
                  className={`${isActiveBreadcrumb(segment, productId?.[0]) ? "cursor-pointer" : "cursor-default"}`}
                  href={
                    isActiveBreadcrumb(segment, productId?.[0])
                      ? `/${segment}`
                      : ""
                  }
                >
                  {segmentMappings[segment] ||
                    product?.name ||
                    segment.charAt(0).toUpperCase() + segment.slice(1)}
                </Link>
                {index !== segments.length - 1 && (
                  <div>
                    <BreadcrumbSeparator />
                  </div>
                )}
              </BreadcrumbItem>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
