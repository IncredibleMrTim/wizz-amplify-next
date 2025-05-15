"use client";
import { useEffect, useState } from "react";
import {
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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Schema } from "amplify/data/resource";

import { columns } from "./productListColumnDefs";
import { ProductTableFooter } from "./ProductTableFooter";
import { ProductFilter } from "./ProductFilter";
import { useAppDispatch, STORE_PATHS } from "@/stores/redux/store";
import { generateClient } from "aws-amplify/api";
import { useRouter } from "next/navigation";

const ProductList = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Schema["Product"]["type"][]>([]);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const client = generateClient<Schema>();

  useEffect(() => {
    const sub = client.models.Product.observeQuery().subscribe({
      next: ({
        items,
        isSynced,
      }: {
        items: Schema["Product"]["type"][];
        isSynced: boolean;
      }) => {
        setData(items);
        if (isSynced) {
          dispatch({ type: STORE_PATHS.SET_PRODUCTS, payload: items });
        }
      },
    });

    return () => sub.unsubscribe();
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
      columnVisibility: {
        ...columnVisibility,
        id: false,
      },
      rowSelection,
    },
  });

  const renderHeaders = () => (
    <TableHeader>
      {table.getHeaderGroups().map((headerGroup) => (
        <TableRow key={headerGroup.id} className="border-stone-200">
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
  );

  const renderBody = () => (
    <TableBody className="overflow-scroll">
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && "selected"}
            className="border-0 odd:bg-stone-100 even:bg-stone-50"
          >
            {row.getVisibleCells().map((cell) => {
              console.log("cell", cell);
              return (
                <TableCell
                  key={cell.id}
                  style={{
                    width: `${cell.column.columnDef.size}px`, // Apply explicit size
                  }}
                  className="overflow-hidden text-ellipsis whitespace-nowrap py-4"
                >
                  {flexRender(cell.column.columnDef.cell, {
                    ...cell.getContext(),
                    onClick: (viewProduct: boolean) => {
                      dispatch({
                        type: STORE_PATHS.SET_CURRENT_PRODUCT,
                        payload: cell.row.original,
                      });

                      if (viewProduct) {
                        router.push(`/admin/products/${cell.row.original.id}`);
                      }
                    },
                  })}
                </TableCell>
              );
            })}
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={columns.length} className="h-24 text-center">
            No results.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );

  return (
    <div className="w-full">
      <ProductFilter table={table} />
      <div className="bg-gray-50 p-4 rounded-sm">
        <div>
          <Table className="table-fixed">{renderHeaders()}</Table>
          <div className="min-h-124 overflow-scroll  border-1 border-stone-100 rounded-sm">
            <Table className="table-fixed">{renderBody()}</Table>
          </div>

          <ProductTableFooter table={table} allRowCount={data.length} />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
