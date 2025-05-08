import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table/build/lib/";
import { Schema } from "amplify/data/resource";

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
);
