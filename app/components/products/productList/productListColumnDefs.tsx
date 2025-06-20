import { CellContext, ColumnDef } from "@tanstack/react-table";
import { Schema } from "amplify/data/resource";
import Link from "next/link";
import {
  FiEdit,
  FiArrowRightCircle,
  FiCheck,
  FiX,
  FiTrash2,
} from "react-icons/fi";

export interface ProductListCustomCellContextProps {
  viewProduct: boolean;
  deleteProduct?: boolean;
}

type CustomCellContext<TData, TValue> = CellContext<TData, TValue> & {
  onClick?: ({
    viewProduct,
    deleteProduct,
  }: ProductListCustomCellContextProps) => void; // Add the onClick handler type
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
        {row.getValue?.("name") ?? "unknown"}
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 80, // Explicit size
    cell: ({ row }) => {
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {row.getValue("description")}
        </div>
      );
    },
  },
  // {
  //   accessorKey: "category",
  //   header: "Category",
  //   size: 30, // Explicit size
  //   cell: ({ row }) => {
  //     return (
  //       <div className="overflow-hidden text-ellipsis whitespace-nowrap">
  //         {row.getValue("category")}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "price",
    header: "Price",
    size: 10, // Explicit size
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
    size: 5, // Explicit size
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
    size: 5, // Explicit size
    cell: ({ row }) => {
      return (
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {row.getValue("isFeatured") ? (
            <FiCheck size={20} className="text-green-600" />
          ) : (
            <FiX size={20} className="text-red-600" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "edit/view",
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
            href={`/product/${(row.getValue("name") as string).replace(
              /\s+/g,
              "-"
            )}`}
            prefetch
          >
            <FiArrowRightCircle size={20} />
          </Link>

          <button
            onClick={() =>
              onClick?.({ viewProduct: false, deleteProduct: true })
            }
          >
            <FiTrash2 size={20} />
          </button>
        </div>
      );
    },
  },
];
