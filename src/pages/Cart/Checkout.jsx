import { useEffect, useState } from "react";
import { useCart } from "../../context/cartContext";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { enqueueSnackbar } from "notistack";
import Loader from "../../components/Common/Loader";
import OrderSummary from "./OrderSummary";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import AddAddressModal from "./AddAddressModal";
import Cookies from "js-cookie";
import { FiArrowLeft } from "react-icons/fi";

const Checkout = () => {
  const { fetchCartCount, selectedCommunity } = useCart();
  const [cartProducts, setCartProducts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartDetails, setCartDetails] = useState(null);
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [openAddAddressModal, setOpenAddAddressModal] = useState(false);
  const userDeliveryAddress = Cookies.get("newDeliveryAddress")
    ? JSON.parse(Cookies.get("newDeliveryAddress"))
    : null;
  const [userNewDeliveryAddress, setUserNewDeliveryAddress] =
    useState(userDeliveryAddress);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const toggleAddAddressModal = () => {
    setOpenAddAddressModal((prev) => !prev);
  };

  const savedAddress = JSON.parse(Cookies.get("userSelectedDeliveryAddress"));
  const savedPaymentMethod = JSON.parse(
    Cookies.get("userSelectedPaymentMethod")
  );

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
      setCartDetails(res?.data?.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      const message =
        error?.response?.data?.message ||
        "Failed to load cart items. Please try again later.";
      setError(message);
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartCount();
    fetchCartProducts();
  }, []);

  const handleNavigate = () => {
    if (!selectedAddress) {
      enqueueSnackbar("Please select a delivery address!", {
        variant: "error",
      });
      return;
    }
    if (!selectedPaymentMethod) {
      enqueueSnackbar("Please select a payment method!", {
        variant: "error",
      });
      return;
    }
    navigate(`/cart/${selectedCommunity?.id}/checkout`);
  };

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
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-28">
      <div className="w-full">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-white flex items-center gap-2"
        >
          <FiArrowLeft className="text-base" /> Back
        </button>
      </div>
      <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-5">
        <div className="w-full rounded-[18px] relative">
          {cartProducts && cartProducts?.length > 0 ? (
            <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-5">
              <div className="w-full col-span-3 p-5 lg:p-7 bg-white rounded-[18px] min-h-[70vh]">
                <div className="w-full flex items-center justify-between">
                  <h1 className="text-[24px] font-semibold leading-none">
                    Checkout
                  </h1>
                </div>
                <div className="w-full border my-5" />

                <div className="w-full mb-5">
                  <div className="w-full">
                    <p className="font-semibold leading-none">
                      Delivery Address
                    </p>
                    <div
                      className={`w-full flex items-center justify-between h-[46px] bg-[var(--secondary-bg)] mt-2 rounded-[12px] px-3`}
                    >
                      <div className="w-full max-w-[90%]">
                        <p className="text-sm">
                          {savedAddress?.address} {savedAddress?.city}{" "}
                          {savedAddress?.state} {savedAddress?.zipcode}{" "}
                          {savedAddress?.country}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="w-full border my-5" />
                  <div className="w-full">
                    <p className="font-semibold leading-none">Payment Method</p>
                    <div
                      className={`w-full flex items-center justify-start gap-3 h-[46px] bg-[var(--secondary-bg)] mt-2 rounded-[12px] px-3`}
                    >
                      <img
                        src="/stripe-icon.png"
                        alt="stripe icon"
                        className="w-[34px] h-[24px]"
                      />
                      <div className="w-full max-w-[90%] text-sm">
                        <p>**** **** **** {savedPaymentMethod?.last4}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full border my-5" />

                {cartProducts && cartProducts.length > 0 ? (
                  cartProducts.map((product, index) => (
                    <div
                      key={index}
                      className={`w-full flex items-center justify-between border-b ${
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
                    </div>
                  ))
                ) : (
                  <div className="w-full flex flex-col items-center justify-center min-h-[50vh] text-gray-500">
                    <p className="text-base font-medium">Your cart is empty.</p>
                  </div>
                )}
              </div>

              <div className="col-span-1 w-full">
                <OrderSummary
                  cartProducts={cartDetails}
                  navigate={navigate}
                  handleNavigate={handleNavigate}
                />
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center min-h-[50vh] text-gray-500 bg-white rounded-[18px]">
              <p className="text-base font-medium">Your cart is empty.</p>
            </div>
          )}
        </div>
      </div>

      <AddAddressModal
        openAddAddressModal={openAddAddressModal}
        toggleAddAddressModal={toggleAddAddressModal}
        setUserNewDeliveryAddress={setUserNewDeliveryAddress}
      />
    </div>
  );
};

export default Checkout;
