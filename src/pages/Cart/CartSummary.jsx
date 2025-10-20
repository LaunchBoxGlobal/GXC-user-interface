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
import CartProductCard from "./CartProductCard";
import UserDeliveryAddress from "./UserDeliveryAddress";
import UserPaymentMethod from "./UserPaymentMethod";
import { FiArrowLeft } from "react-icons/fi";

const CartSummary = () => {
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

  const removeAllItemsFromCart = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${BASE_URL}/communities/${cartDetails?.communityId}/cart`,
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
      }
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

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
                    Cart
                  </h1>
                  {cartProducts && cartProducts?.length > 0 && (
                    <button
                      type="button"
                      onClick={() => removeAllItemsFromCart()}
                      className="flex items-center gap-1"
                    >
                      <img
                        src="/trash-icon-red.png"
                        alt="trash icon"
                        className="w-[14px] h-[15px] object-contain"
                      />
                      <span className="text-sm">Remove All</span>
                    </button>
                  )}
                </div>
                <div className="w-full border my-5" />

                <div className="w-full mb-5">
                  <UserDeliveryAddress
                    toggleAddAddressModal={toggleAddAddressModal}
                    userNewDeliveryAddress={userNewDeliveryAddress}
                    selectedAddress={selectedAddress}
                    setSelectedAddress={setSelectedAddress}
                  />
                  <div className="w-full border my-5" />
                  <UserPaymentMethod
                    selectedPaymentMethod={selectedPaymentMethod}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                  />
                </div>

                <div className="w-full border my-5" />

                {cartProducts && cartProducts.length > 0 ? (
                  cartProducts.map((product, index) => (
                    <CartProductCard product={product} index={index} />
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

export default CartSummary;
