"use client";
import { Schema } from "amplify/data/resource";
import { StorageImage } from "@aws-amplify/ui-react-storage";

interface ProductCardProps {
  product: Schema["Product"]["type"];
  showTitle?: boolean;
  showDescription?: boolean;
  showImage?: boolean;
  showPrice?: boolean;
  showQuantity?: boolean;

  onClick?: (product: Schema["Product"]) => void;
}

const ProductCard = ({
  product,
  showTitle = true,
  showDescription = true,
  showImage = true,
  showPrice = true,
}: ProductCardProps) => {
  return (
    <div
      key={product.id}
      className="w-1/3 flex flex-col !justify-between !h-max  bg-white p-4"
    >
      <div className="flex flex-col gap-4 ">
        {showDescription && <p>{product.description}</p>}
      </div>

      {showImage && product?.imageUrl && (
        <div className="flex justify-center">
          <StorageImage
            path={product.imageUrl}
            alt={product.name}
            className="flex self-center object-scale-down w-full"
          />
        </div>
      )}

      <div className="flex flex-col py-2 justify-between">
        {showTitle && (
          <p className="flex w-full justify-center pb-1">{product.name}</p>
        )}
        {showPrice && (
          <div className="flex w-full justify-center">£{product.price} GBP</div>
        )}
      </div>

      <div className="mt-4 bottom-4 flex justify-between">
        {/* <Button
          className="mt-4 bg-blue-500 text-white p-2 rounded-md"
          onClick={() => {
            if (onClick) {
              onClick(product);
            }
          }}
        >
          Place Order
        </Button> */}
      </div>
    </div>
  );
};
export default ProductCard;
