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

  const hiddenSegments = ["admin", "basket"];
  const filteredSegments = segments.filter(
    (segment) => !hiddenSegments.includes(segment)
  );
  return pathname.includes("admin") ? null : (
    <div className="items-center justify-between text-black p-4 hidden md:flex">
      <Breadcrumb>
        <BreadcrumbList>
          {filteredSegments.map((segment, index) => {
            return (
              <div key={index} className="flex place-items-center gap-2">
                <BreadcrumbItem key={index}>
                  <Link
                    href={`/${
                      segmentMappings[segment] === "Products"
                        ? "/"
                        : filteredSegments.slice(0, index + 1).join("/")
                    }`}
                  >
                    {segmentMappings[segment] ||
                      product?.name?.replace(/-/g, " ") ||
                      segment.replace(/-/g, " ")}
                  </Link>
                </BreadcrumbItem>

                <BreadcrumbSeparator
                  className={`${index === filteredSegments.length - 1 && "hidden"}`}
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
