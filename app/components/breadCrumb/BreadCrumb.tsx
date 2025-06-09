"use client";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/stores/store";
import { segmentMappings } from "@/components/breadCrumb/breadcrumbMappings";

export const BreadCrumb = () => {
  const product = useAppSelector((state) => state.products.currentProduct);
  const pathname = usePathname();

  const segments = pathname.split("/").filter((segment) => segment !== "");
  return (
    <div className="flex items-center justify-between text-black p-4">
      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((segment, index) => {
            if (pathname.includes("admin")) return null; // don't show breadcrumb in admin
            // don't show breadcrumb for product page
            return (
              <div key={index} className="flex place-items-center gap-2">
                <BreadcrumbItem key={index}>
                  <Link
                    href={`/${segmentMappings[segment] === "Products" ? "/" : segments.slice(0, index + 1).join("/")}`}
                  >
                    {segmentMappings[segment] ||
                      product?.name?.replace(/-/g, " ") ||
                      segment.replace(/-/g, " ")}
                  </Link>
                </BreadcrumbItem>

                <BreadcrumbSeparator
                  className={`${index === segments.length - 1 && "hidden"}`}
                >
                  <p>/</p>
                </BreadcrumbSeparator>
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
