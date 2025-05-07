"use client";
import { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProducts } from "@/services/products";
import { Schema } from "amplify/data/resource";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const columns: ColumnDef<Schema["Product"]["type"]>[] = [
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
];

const ProductList = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Schema["Product"]["type"][]>([]);

  useEffect(() => {
    const getData = async () => {
      const d = await getProducts();
      return d;
    };
    getData().then((d) => setData(d as Schema["Product"]["type"][]));
  }, []);

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      minSize: 50,
      maxSize: 300,
      size: 100, // Default size
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter products..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table className="table-fixed">
          {" "}
          {/* Ensure table layout is fixed */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width: `${header.column.columnDef.size}px`, // Apply explicit size
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        width: `${cell.column.columnDef.size}px`, // Apply explicit size
                      }}
                      className="overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} of {data.length}{" "}
          products
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
