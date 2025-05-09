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
import { getProducts } from "@/services/products";
import { Schema } from "amplify/data/resource";

import { columns } from "./productListColumnDefs";
import { ProductTableFooter } from "./ProductTableFooter";
import { ProductFilter } from "./ProductFilter";
import {
  useAppDispatch,
  useAppSelector,
  STORE_PATHS,
} from "@/stores/redux/store";

const ProductList = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Schema["Product"]["type"][]>([]);

  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products.allProducts);

  useEffect(() => {
    const getData = async () => {
      const d = await getProducts();
      console.log("d", d);
      return d;
    };
    getData().then((d) =>
      dispatch({ type: STORE_PATHS.SET_PRODUCTS, payload: d })
    );
  }, []);

  const table = useReactTable({
    data: products,
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
            {row.getVisibleCells().map((cell) => (
              <TableCell
                key={cell.id}
                style={{
                  width: `${cell.column.columnDef.size}px`, // Apply explicit size
                }}
                className="overflow-hidden text-ellipsis whitespace-nowrap py-4"
              >
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
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
      <div className="mt-4">
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
