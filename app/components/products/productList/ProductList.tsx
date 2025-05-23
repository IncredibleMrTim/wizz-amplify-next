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
import { remove } from "aws-amplify/storage";
import {
  columns,
  ProductListCustomCellContextProps,
} from "./productListColumnDefs";
import { ProductTableFooter } from "./ProductTableFooter";
import { ProductFilter } from "./ProductFilter";
import { useAppDispatch, useAppSelector, STORE_PATHS } from "@/stores/store";
import { generateClient } from "aws-amplify/api";
import { useRouter } from "next/navigation";

const ProductList = () => {
  const client = generateClient<Schema>();
  const allProducts = useAppSelector((state) => state.products.allProducts);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<Schema["Product"]["type"][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await client.models.Product.list();
      setData(data);
      dispatch({ type: STORE_PATHS.SET_PRODUCTS, payload: data });
    };

    // Check if products are already in the store
    // If not, fetch data from the API
    // If yes, set the data from the store
    if (!allProducts.length) {
      fetchData();
    } else {
      setData(allProducts);
    }
  }, []);

  const table = useReactTable({
    data,
    columns,
    defaultColumn: {
      minSize: 50,
      maxSize: 300,
      size: 100,
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
                    onClick: async ({
                      viewProduct,
                      deleteProduct,
                    }: ProductListCustomCellContextProps) => {
                      dispatch({
                        type: STORE_PATHS.SET_CURRENT_PRODUCT,
                        payload: cell.row.original,
                      });

                      // TODO: Need to add conformation modal for delete
                      if (deleteProduct) {
                        client.models.Product.delete({
                          id: cell.row.original.id,
                        });

                        if (cell.row.original?.imageUrl) {
                          await remove({
                            path: cell.row.original.imageUrl,
                          });
                        }

                        const updatedProductList = data.filter(
                          (product) => product.id !== cell.row.original.id
                        );

                        dispatch({
                          type: STORE_PATHS.SET_PRODUCTS,
                          payload: updatedProductList,
                        });
                        setData(updatedProductList);
                      }

                      if (viewProduct && !deleteProduct) {
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
