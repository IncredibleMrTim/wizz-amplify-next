"use client";
import { TextField, TextArea, DropdownMenu, Button } from "@radix-ui/themes";

const AddProduct = () => {
  return (
    <div>
      <h1>Add New Product</h1>
      <TextField.Root>
        <TextField.Slot>Product Name</TextField.Slot>
      </TextField.Root>
      <TextArea placeholder="Product Description" />

      <TextField.Root>
        <TextField.Slot>Product Price</TextField.Slot>
      </TextField.Root>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Button variant="soft">
            Options
            <DropdownMenu.TriggerIcon />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item>Category 1</DropdownMenu.Item>
          <DropdownMenu.Item>Category 2</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <TextField.Root>
        <TextField.Slot>Stock</TextField.Slot>
      </TextField.Root>
    </div>
  );
};
export default AddProduct;
