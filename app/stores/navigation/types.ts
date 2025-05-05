export enum MenuItems {
  HOME = "Home",
  DRESSES = "Dresses",
  PAGEANT_ACCESSORIES = "Pageant Accessories",
  DANCE_ACCESSORIES = "Dance Accessories",
}

export type MenuItem = {
  name: MenuItems;
  path: string;
  isActive?: boolean;
};
