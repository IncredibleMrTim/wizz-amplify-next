"use client";
import { Schema } from "amplify/data/resource";
import { Button, Flex } from "@radix-ui/themes";

interface ProductCardProps {
  product: Schema["Product"]["type"];
  onClick?: (product: Schema["Product"]["type"]) => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
  return (
    <div
      key={product.id}
      className="flex flex-col justify-between border-0 rounded-md md:border-1 shadow-md p-4 h-full"
    >
      <div className="flex flex-col gap-4 border-b-1 border-gray-300 mb-4 pb-4">
        <h2>{product.name}</h2>
        <span>Price: £{product.price}</span>
        <p>{product.description}</p>
      </div>
      {product?.imageUrl && (
        <img
          src={`${process.env.AWS_S3_PRODUCT_IMAGE_URL}${product.imageUrl}`}
          alt={product.name}
          className="flex self-center object-scale-down h-52 w-52"
        />
      )}
      <Flex align="end" direction={"column"} className="mt-4">
        <Button
          className="mt-4 bg-blue-500 text-white p-2 rounded-md"
          onClick={() => {
            if (onClick) {
              onClick(product);
            }
          }}
        >
          Place Order
        </Button>
      </Flex>
    </div>
  );
};
export default ProductCard;
