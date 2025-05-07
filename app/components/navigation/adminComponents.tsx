import { NavComponent } from "./Navigation";

const components: NavComponent[] = [
  {
    id: "admin-home",
    type: "button",
    title: "List Products",
    href: "/admin",
  },
  {
    id: "new-product",
    type: "button",
    title: "New Product",
    href: "/admin/product",
  },
];

export default components;
