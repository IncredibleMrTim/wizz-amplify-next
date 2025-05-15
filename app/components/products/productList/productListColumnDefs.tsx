import { Separator } from "@radix-ui/themes";
import { CellContext, ColumnDef, RowData } from "@tanstack/react-table";
import { Schema } from "amplify/data/resource";
import Link from "next/link";
import { FiEdit, FiArrowRightCircle, FiCheck, FiX } from "react-icons/fi";

type CustomCellContext<TData, TValue> = CellContext<TData, TValue> & {
  onClick?: ({ viewProduct }: { viewProduct: boolean }) => void; // Add the onClick handler type
};

export const columns: ColumnDef<Schema["Product"]["type"]>[] = [
  {
    accessorKey: "id",
    header: "id",
    size: 20, // Explicit size
    cell: ({ row }) => row.getValue("id"),
  },
  {
    accessorKey: "name",
    header: "Name",
    size: 50, // Explicit size
    cell: ({ row }) => (
      <div className="overflow-hidden text-ellipsis whitespace-nowrap">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 100, // Explicit size
    cell: ({ row }) => {
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {row.getValue("description")}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    size: 30, // Explicit size
    cell: ({ row }) => {
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {row.getValue("category")}
        </div>
      );
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    size: 20, // Explicit size
    cell: ({ row }) => {
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {row.getValue("price")}
        </div>
      );
    },
  },
  {
    accessorKey: "stock",
    header: "Stock",
    size: 20, // Explicit size
    cell: ({ row }) => {
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {row.getValue("stock")}
        </div>
      );
    },
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    size: 20, // Explicit size
    cell: ({ row }) => {
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {row.getValue("isFeatured") ? (
            <FiCheck size={20} className="text-green-600" />
          ) : (
            <FiX size={20} className="text-red-500" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "edit",
    header: "Edit/View",
    size: 20, // Explicit size
    cell: ({
      row,
      onClick,
    }: CustomCellContext<Schema["Product"]["type"], unknown>) => {
      return (
        <div className="flex gap-4 items-center">
          <Link
            href={`/admin/product/${row.getValue("id")}`}
            onClick={() => onClick?.({ viewProduct: false })}
            prefetch
          >
            <FiEdit size={20} />
          </Link>

          <Link
            href={`/admin/product/${row.getValue("id")}`}
            onClick={() => onClick?.({ viewProduct: true })}
            prefetch
          >
            <FiArrowRightCircle size={20} />
          </Link>
        </div>
      );
    },
  },
];
