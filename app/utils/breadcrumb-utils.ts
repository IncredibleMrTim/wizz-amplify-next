export const segmentMappings: { [key: string]: string } = {
  admin: "Admin Home",
  product: "Product",
};

export const isActiveBreadcrumb = (segment: string, productId?: string) => {
  return productId !== segment && segment !== "product";
};
