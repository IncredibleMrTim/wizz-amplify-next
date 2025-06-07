"use client";
import { Schema } from "amplify/data/resource";
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
      <div className="flex h-full flex-col gap-4 justify-between">
        {showDescription && (
          <div className="flex flex-col gap-4 ">
            <p>{product.description}</p>
          </div>
        )}
        {showImage && product?.images?.[0] && (
          <div className="flex justify-center align-top relative">
            <Link
              prefetch
              href={`/product/${product.name.replace(/\s+/g, "-")}`}
              onClick={() => {
                dispatch({
                  type: STORE_PATHS.SET_CURRENT_PRODUCT,
                  payload: product,
                });
              }}
            >
              <img
                src={`${process.env.AWS_S3_PRODUCT_IMAGE_URL}${product.images?.[0].url}`}
                alt={product.name}
                className="flex self-center w-full h-96   object-cover"
              />
            </Link>
            <div className="flex w-full align-bottom absolute bottom-2 px-2">
              <div
                className={`flex gap-1 w-full ${isAdmin ? `justify-between` : `justify-end`}`}
              >
                {isAdmin && (
                  <Link
                    prefetch
                    href={`/admin/product/${product.id}`}
                    className="p-3 flex self-end rounded-full bg-gray-50 opacity-70"
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
                  className="p-3 flex self-end justify-self-end rounded-full bg-gray-50 opacity-70"
                  aria-label="Add to cart"
                  onClick={() => {}}
                >
                  <FiShoppingCart />
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col justify-between items-center w-full px-4 gap-2">
          {showTitle && <p className="text-center">{product.name}</p>}
          {showPrice && (
            <p className="flex text-gray-500">£{product.price} GBP</p>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
