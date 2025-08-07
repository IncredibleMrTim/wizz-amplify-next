import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { segmentMappings } from "@/components/breadCrumb/breadcrumbMappings";
import { Schema } from "amplify/data/resource";

interface BreadCrumbProps {
  pathname: string;
  product?: Schema["Product"]["type"] | null;
  segments: string[];
}

export const BreadCrumb = ({
  pathname,
  product,
  segments,
}: BreadCrumbProps) => {
  return pathname.includes("admin") ? null : (
    <div className="items-center justify-between text-black p-4 hidden md:flex">
      <Breadcrumb>
        <BreadcrumbList>
          {segments.map((segment, index) => {
            return (
              <div key={index} className="flex place-items-center gap-2">
                <BreadcrumbItem key={index}>
                  <Link
                    href={`/${
                      segmentMappings[segment] === "Products"
                        ? "/"
                        : segments.slice(0, index + 1).join("/")
                    }`}
                  >
                    {segmentMappings[segment] ||
                      product?.name?.replace(/-/g, " ")}
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
