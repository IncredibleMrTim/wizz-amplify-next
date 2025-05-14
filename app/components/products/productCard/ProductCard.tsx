"use client";
import { Schema } from "amplify/data/resource";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { Button } from "@radix-ui/themes";
import {
  useAppSelector,
  useAppDispatch,
  STORE_PATHS,
} from "@/stores/redux/store";
import { useRouter } from "next/navigation";
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
  const isAdmin = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

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
        {isAdmin && (
          <Button
            variant="soft"
            className="mt-4 bg-blue-500 text-white p-2 rounded-md"
            onClick={() => {
              dispatch({
                type: STORE_PATHS.SET_CURRENT_PRODUCT,
                payload: product,
              });
              router.push(`/admin/product/${product.id}`);
            }}
          >
            Edit Product
          </Button>
        )}
        <Button className="mt-4 bg-blue-500 text-white p-2 rounded-md">
          Place Order
        </Button>
      </div>
    </div>
  );
};
export default ProductCard;
