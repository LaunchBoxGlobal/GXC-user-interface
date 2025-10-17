import React, { useEffect, useState } from "react";
import { useCart } from "../../context/cartContext";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { enqueueSnackbar } from "notistack";
import Loader from "../../components/Common/Loader";

const CartPage = () => {
  const { fetchCartCount, selectedCommunity } = useCart();
  const [cartProducts, setCartProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // 👈 added error state

  const fetchCartProducts = async () => {
    if (!selectedCommunity) {
      enqueueSnackbar(`Community ID not found!`, { variant: "error" });
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        `${BASE_URL}/communities/${selectedCommunity?.id}/cart`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setCartProducts(res?.data?.data?.items);
    } catch (error) {
      console.error("Error fetching cart:", error);
      const message =
        error?.response?.data?.message ||
        "Failed to load cart items. Please try again later.";
      setError(message); // 👈 store error message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartCount();
    fetchCartProducts();
  }, []);

  // ✅ Loader
  if (loading) {
    return (
      <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-20">
        <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-2">
          <div className="w-full rounded-[18px] relative min-h-[60vh] bg-white flex items-center justify-center">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  // ✅ Error UI
  if (error) {
    return (
      <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-20">
        <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-2">
          <div className="w-full rounded-[18px] relative min-h-[60vh] bg-white flex flex-col items-center justify-center gap-4">
            <img
              src="/error-icon.png"
              alt="Error"
              className="w-14 h-14 opacity-70"
            />
            <p className="text-lg font-semibold text-gray-800 text-center max-w-md">
              {error}
            </p>
            <button
              onClick={fetchCartProducts}
              className="bg-[var(--primary-color)] text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Normal UI
  return (
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-20">
      <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-2">
        <div className="w-full rounded-[18px] relative">
          <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="w-full col-span-3 p-5 lg:p-7 bg-white rounded-[18px] min-h-[70vh]">
              <div className="w-full flex items-center justify-between">
                <h1 className="text-[24px] font-semibold leading-none">Cart</h1>
                <button type="button" className="flex items-center gap-1">
                  <img
                    src="/trash-icon-red.png"
                    alt="trash icon"
                    className="w-[14px] h-[15px] object-contain"
                  />
                  <span className="text-sm">Remove All</span>
                </button>
              </div>
              <div className="w-full border my-5" />

              {cartProducts && cartProducts.length > 0 ? (
                cartProducts.map((product, index) => (
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
                          <button
                            type="button"
                            className="flex items-center gap-1"
                          >
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
                      <p className="font-normal text-[#7B7B7B] leading-none text-sm">
                        Price
                      </p>
                      <p className="font-semibold text-[20px] leading-none">
                        ${product?.product?.price}
                      </p>
                    </div>
                    <div className="col-span-1 hidden lg:flex justify-end">
                      <button type="button" className="flex items-center gap-1">
                        <img
                          src="/trash-icon-red.png"
                          alt="trash icon"
                          className="w-[14px] h-[15px] object-contain"
                        />
                        <span className="text-sm">Remove All</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="w-full flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
                  <img
                    src="/empty-cart.png"
                    alt="Empty cart"
                    className="w-28 h-28 mb-4 opacity-70"
                  />
                  <p className="text-base font-medium">Your cart is empty.</p>
                </div>
              )}
            </div>

            <div className="col-span-1 w-full">
              <div className="bg-white rounded-[18px] w-full">
                <h2 className="text-[24px] font-semibold leading-none px-5 pt-5 lg:pt-7">
                  Order Summary
                </h2>
                <div className="w-full border my-5" />
                <div className="w-full px-5 pb-5"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
