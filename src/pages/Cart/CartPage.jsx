import React, { useEffect, useState } from "react";
import { useCart } from "../../context/cartContext";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { enqueueSnackbar } from "notistack";
import { useAppContext } from "../../context/AppContext";

const CartPage = () => {
  const { fetchCartCount } = useCart();
  const { selectedCommunity } = useAppContext();
  const [cartProducts, setCartProducts] = useState(null);

  const fetchCartProducts = async () => {
    if (!selectedCommunity) {
      enqueueSnackbar(`Community ID not found!`, {
        variant: "error",
      });
      return;
    }
    try {
      const res = await axios.get(
        `${BASE_URL}/communities/${selectedCommunity?.id}/cart`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      // console.log("cart products >>> ", res?.data);
      setCartProducts(res?.data?.data?.items);
    } catch (error) {
      console.log("err while cart products >>> ", error);
      handleApiError(error, navigate);
    }
  };

  useEffect(() => {
    fetchCartCount();
    fetchCartProducts();
  }, []);

  return (
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-20">
      <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-2">
        <div className="w-full rounded-[18px] relative min-h-[70vh]">
          <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-5">
            <div className="w-full col-span-3 p-5 lg:p-7 bg-white rounded-[18px]">
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

              {cartProducts &&
                cartProducts?.length > 0 &&
                cartProducts?.map((product, index) => {
                  return (
                    <div
                      key={index}
                      className={`w-full grid grid-cols-4 border-b ${
                        index == 0 ? "pb-5" : "py-5"
                      }`}
                    >
                      <div className="flex items-center gap-3 col-span-2">
                        <img
                          src={product?.product?.images[0]?.imageUrl}
                          alt=""
                          className="w-[80px] max-w-[80px] h-[80px] max-h-[80px] object-cover rounded-xl"
                        />
                        <div className="flex flex-col gap-2">
                          <p className="font-semibold leading-none">
                            {product?.product?.title}
                          </p>
                          <p className="font-normal text-[#7B7B7B] leading-none">
                            {product?.product?.deliveryMethod === "pickup"
                              ? "Pickup"
                              : product?.product?.deliveryMethod === "delivery"
                              ? "Delivery"
                              : "Pickup/Delivery"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-start justify-center gap-2 col-span-1">
                        <p className="font-normal text-[#7B7B7B] leading-none text-sm">
                          Price
                        </p>
                        <p className="font-semibold text-[20px] leading-none">
                          ${product?.product?.price}
                        </p>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button
                          type="button"
                          className="flex items-center gap-1"
                        >
                          <img
                            src="/trash-icon-red.png"
                            alt="trash icon"
                            className="w-[14px] h-[15px] object-contain"
                          />
                          <span className="text-sm">Remove All</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
            <div className="col-span-1 w-full">
              <div className="bg-white rounded-[18px] w-full">
                <h2 className="text-[24px] font-semibold leading-none px-5  pt-5 lg:pt-7">
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
