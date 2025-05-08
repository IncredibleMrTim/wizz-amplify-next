import { ColumnDef } from "@tanstack/react-table";
import { Schema } from "amplify/data/resource";
import Link from "next/link";

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
          {row.getValue("isFeatured") ? "Yes" : "No"}
        </div>
      );
    },
  },
  {
    accessorKey: "edit",
    header: "Edit",
    size: 20, // Explicit size
    cell: ({ row }) => {
      return (
        <Link href={`/admin/product/${row.getValue("id")}`} prefetch>
          Edit
        </Link>
      );
    },
  },
];
