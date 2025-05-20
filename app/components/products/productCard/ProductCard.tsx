"use client";
import { Schema } from "amplify/data/resource";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { Button } from "@radix-ui/themes";
import { useAppSelector, useAppDispatch, STORE_PATHS } from "@/stores/store";
import { useRouter } from "next/navigation";
import { FiShoppingCart } from "react-icons/fi";
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
  const isAdmin = useAppSelector((state) => state.auth.currentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <div
      key={product.id}
      className="w-1/3 flex flex-col !justify-between bg-white "
    >
      <div className="flex h-full flex-col justify-between border-1 border-gray-200 rounded-sm  p-4">
        {showDescription && (
          <div className="flex flex-col gap-4 ">
            <p>{product.description}</p>
          </div>
        )}
        {showImage && product?.imageUrl && (
          <div className="flex justify-center h-3/5">
            <StorageImage
              path={product.imageUrl}
              alt={product.name}
              className="flex self-center object-scale-down w-full"
            />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col py-2 justify-between">
            {showTitle && (
              <p className="flex w-full justify-center pb-1">{product.name}</p>
            )}
          </div>
        </div>

        <div className=" bottom-4 flex justify-between h-1/5">
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
          <div className="flex w-full justify-between align-bottom h-full">
            {showPrice && (
              <div className="flex font-bold self-end">
                £{product.price} GBP
              </div>
            )}
            <div className="p-3 flex self-end rounded-full bg-gray-50">
              <FiShoppingCart />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
