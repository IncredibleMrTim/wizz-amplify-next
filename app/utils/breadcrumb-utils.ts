export const segmentMappings: { [key: string]: string } = {
  admin: "Product List",
  product: "Product",
};

export const isActiveBreadcrumb = (segment: string, productId?: string) => {
  return productId !== segment && segment !== "product";
};
