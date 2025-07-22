import { Schema } from "amplify/data/resource";

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table/build/lib/";

export const ProductTableFooter = ({
  table,
  allRowCount,
}: {
  table: Table<Schema["Product"]["type"]>;
  allRowCount: number;
}) => (
  <div className="flex items-center justify-end space-x-2 py-4">
    <div className="flex-1 text-sm text-muted-foreground">
      Showing {table.getFilteredRowModel().rows.length} of {allRowCount}{" "}
      products
    </div>
    <div className="flex gap-2">
      <Button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <Button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
    </div>
  </div>
);
