import axios from "axios";
import React from "react";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { enqueueSnackbar } from "notistack";
import { handleApiError } from "../../utils/handleApiError";
import { useCart } from "../../context/cartContext";

const CartProductCard = ({
  product,
  index,
  fetchCartProducts,
  cartDetails,
  setLoading,
}) => {
  const { fetchCartCount } = useCart();
  const removeItemFromCart = async (productId) => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${BASE_URL}/communities/${cartDetails?.communityId}/cart/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response?.data?.success) {
        enqueueSnackbar(
          response?.data?.message || "Cart cleared successfully",
          {
            variant: "success",
          }
        );
        fetchCartProducts();
        fetchCartCount();
      }
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      key={index}
      className={`w-full grid grid-cols-4 border-b ${
        index === 0 ? "pb-5" : "py-5"
      }`}
    >
      <div className="flex items-center gap-3 col-span-4 lg:col-span-2">
        <img
          src={product?.product?.images[0]?.imageUrl}
          alt=""
          className="min-w-[80px] max-w-[80px] h-[80px] max-h-[80px] object-cover rounded-xl"
        />
        <div className="w-full flex flex-col gap-2">
          <p className="font-semibold leading-none break-words max-w-[280px] text-sm lg:text-base">
            {product?.product?.title?.length > 30
              ? `${product?.product?.title?.slice(0, 30)}...`
              : product?.product?.title}
          </p>
          <p className="font-normal text-[#7B7B7B] leading-none text-xs lg:text-base">
            {product?.product?.deliveryMethod === "pickup"
              ? "Pickup"
              : product?.product?.deliveryMethod === "delivery"
              ? "Delivery"
              : "Pickup/Delivery"}
          </p>
          <div className="w-full lg:hidden flex items-end justify-between">
            <div className="flex flex-col items-start justify-center gap-0 col-span-4">
              <p className="font-normal text-[#7B7B7B] leading-none text-xs lg:text-sm">
                Price
              </p>
              <p className="font-semibold text-sm lg:text-[20px] leading-none">
                ${product?.product?.price}
              </p>
            </div>
            <button type="button" className="flex items-center gap-1">
              <img
                src="/trash-icon-red.png"
                alt="trash icon"
                className="w-[14px] h-[15px] object-contain"
              />
            </button>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-col items-start justify-center gap-2 col-span-4 lg:col-span-1">
        <p className="font-normal text-[#7B7B7B] leading-none text-sm">Price</p>
        <p className="font-semibold text-[20px] leading-none">
          ${product?.product?.price}
        </p>
      </div>
      <div className="col-span-1 hidden lg:flex justify-end">
        <button
          type="button"
          onClick={() => removeItemFromCart(product?.product?.id)}
          className="flex items-center gap-1"
        >
          <img
            src="/trash-icon-red.png"
            alt="trash icon"
            className="w-[14px] h-[15px] object-contain"
          />
          <span className="text-sm">Remove</span>
        </button>
      </div>
    </div>
  );
};

export default CartProductCard;
