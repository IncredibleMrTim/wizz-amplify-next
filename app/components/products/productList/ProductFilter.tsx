import {
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenu,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table/build/lib/";
import { Schema } from "amplify/data/resource";
import { Check, X } from "lucide-react";

export const ProductFilter = ({
  table,
}: {
  table: Table<Schema["Product"]["type"]>;
}) => {
  return (
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
        <DropdownMenuContent
          align="end"
          className="bg-white shadow-md p-4 gap-2"
        >
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide() && column.id !== "id")
            .map((column) => {
              return (
                <div
                  key={column.id}
                  className="grid grid-cols-[20%_80%] items-center border-b-1 border-b-stone-200 py-2"
                >
                  {column.getIsVisible() ? (
                    <Check size={16} className="mr-2 text text-green-500" />
                  ) : (
                    <X size={16} className="mr-2 text text-red-500" />
                  )}
                  <p
                    className="ml-2 capitalize !text-sm text-stone-800 cursor-pointer"
                    onClick={() =>
                      column.toggleVisibility(!column.getIsVisible())
                    }
                  >
                    {column.id}
                  </p>
                </div>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
