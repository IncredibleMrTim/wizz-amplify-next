"use client";
import { Schema } from "amplify/data/resource";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { Button } from "@radix-ui/themes";
import { useAppSelector, useAppDispatch, STORE_PATHS } from "@/stores/store";
import { useRouter } from "next/navigation";
import { FiShoppingCart, FiEdit } from "react-icons/fi";
import Link from "next/link";
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
      className="fade-in-product w-1/4 flex flex-col h-full bg-white"
    >
      <div className="flex h-full flex-col border-1 border-gray-200 rounded-sm p-4 gap-2 justify-between">
        {showDescription && (
          <div className="flex flex-col gap-4 ">
            <p>{product.description}</p>
          </div>
        )}
        {showImage && product?.imageUrl && (
          <div className="flex justify-center">
            {/* <StorageImage
              path={product.imageUrl}
              alt={product.name}
              className="flex self-center object-scale-down w-full h-max"
            /> */}
            <img
              src={`${process.env.AWS_S3_PRODUCT_IMAGE_URL}${product.imageUrl}`}
              alt={product.name}
              className="flex self-center object-scale-down w-full h-full"
            />
          </div>
        )}
        <div className="h-10">
          {showTitle && <p className="flex self-start">{product.name}</p>}
        </div>

        <div className="flex justify-self-end">
          <div className="flex w-full justify-between align-bottom h-10">
            {showPrice && (
              <div className="flex font-bold self-end mb-2">
                £{product.price} GBP
              </div>
            )}
            <div className="flex gap-1">
              {isAdmin && (
                <Link
                  prefetch
                  href={`/admin/product/${product.id}`}
                  className="p-3 flex self-end "
                  aria-label="Edit Product"
                  onClick={() => {
                    dispatch({
                      type: STORE_PATHS.SET_CURRENT_PRODUCT,
                      payload: product,
                    });
                  }}
                >
                  <FiEdit />
                </Link>
              )}
              <button
                className="p-3 flex self-end "
                aria-label="Add to cart"
                onClick={() => {
                  // Add functionality for adding the product to the cart
                }}
              >
                <FiShoppingCart />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
