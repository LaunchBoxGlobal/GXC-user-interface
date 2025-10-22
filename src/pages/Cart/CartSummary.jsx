import { useEffect, useState } from "react";
import { useCart } from "../../context/cartContext";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { enqueueSnackbar } from "notistack";
import Loader from "../../components/Common/Loader";
import OrderSummary from "./OrderSummary";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import AddAddressModal from "./AddAddressModal";
import Cookies from "js-cookie";
import CartProductCard from "./CartProductCard";
import UserDeliveryAddress from "./UserDeliveryAddress";
import UserPaymentMethod from "./UserPaymentMethod";
import { FiArrowLeft } from "react-icons/fi";
import EditAddressModal from "./EditAddressModal";

const CartSummary = () => {
  const {
    fetchCartCount,
    loading,
    setLoading,
    error,
    fetchCartProducts,
    cartProducts,
    cartDetails,
  } = useCart();

  const navigate = useNavigate();
  const [openAddAddressModal, setOpenAddAddressModal] = useState(false);
  const [openEditAddressModal, setOpenEditAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [userNewDeliveryAddress, setUserNewDeliveryAddress] = useState(null);

  // 🔁 Load user’s saved delivery address (from cookies)
  useEffect(() => {
    const savedAddress = Cookies.get("newDeliveryAddress");
    if (savedAddress) {
      setUserNewDeliveryAddress(JSON.parse(savedAddress));
    }
  }, []);

  // 🔁 Fetch cart data on mount
  useEffect(() => {
    fetchCartCount();
    fetchCartProducts();
  }, []);

  const toggleAddAddressModal = () => setOpenAddAddressModal((prev) => !prev);
  const toggleEditAddressModal = () => setOpenEditAddressModal((prev) => !prev);

  // ✅ Check if any product requires delivery
  const isAnyDeliveryTypeProduct = cartProducts?.some(
    (p) =>
      p?.product?.deliveryMethod === "delivery" ||
      p?.product?.deliveryMethod === "both"
  );

  // 🧹 Remove all cart items
  const removeAllItemsFromCart = async () => {
    setLoading(true);
    try {
      const response = await axios.delete(
        `${BASE_URL}/communities/${cartDetails?.communityId}/cart`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      if (response?.data?.success) {
        enqueueSnackbar(
          response?.data?.message || "Cart cleared successfully",
          {
            variant: "success",
          }
        );
        Cookies.remove("newDeliveryAddress");
        Cookies.remove("userSelectedDeliveryAddress");
        fetchCartProducts();
        fetchCartCount();
      }
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  // 🛒 Proceed to checkout validation
  const handleNavigate = () => {
    if (isAnyDeliveryTypeProduct && !selectedAddress) {
      return enqueueSnackbar("Please select a delivery address!", {
        variant: "error",
      });
    }

    const community = JSON.parse(Cookies.get("selected-community"));

    if (!selectedPaymentMethod) {
      return enqueueSnackbar("Please select a payment method!", {
        variant: "error",
      });
    }
    navigate(`/cart/${community?.id}/checkout`);
  };

  // 🌀 Loader
  if (loading) {
    return (
      <div className="w-full padding-x relative -top-20">
        <div className="w-full bg-[var(--light-bg)] rounded-[30px] p-4 mt-2">
          <div className="w-full rounded-[18px] min-h-[60vh] bg-white flex items-center justify-center">
            <Loader />
          </div>
        </div>
      </div>
    );
  }

  // ⚠️ Error UI
  if (error) {
    return (
      <div className="w-full padding-x relative -top-20">
        <div className="w-full bg-[var(--light-bg)] rounded-[30px] p-4 mt-2">
          <div className="w-full rounded-[18px] min-h-[60vh] bg-white flex flex-col items-center justify-center gap-4">
            <p className="text-lg font-medium text-gray-800 text-center max-w-md">
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
    <div className="w-full padding-x relative -top-28">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-sm text-white flex items-center gap-2"
      >
        <FiArrowLeft className="text-base" /> Back
      </button>

      <div className="w-full bg-[var(--light-bg)] rounded-[30px] p-4 mt-5">
        <div className="w-full rounded-[18px]">
          {cartProducts?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* 🛒 Cart Section */}
              <div className="col-span-2 p-5 lg:p-7 bg-white rounded-[18px] min-h-[70vh]">
                <div className="flex items-center justify-between">
                  <h1 className="text-[24px] font-semibold">Cart</h1>
                  <button
                    type="button"
                    onClick={removeAllItemsFromCart}
                    className="flex items-center gap-1"
                  >
                    <img
                      src="/trash-icon-red.png"
                      alt="trash icon"
                      className="w-[14px] h-[15px]"
                    />
                    <span className="text-sm">Remove All</span>
                  </button>
                </div>

                <div className="mb-5">
                  {isAnyDeliveryTypeProduct && (
                    <UserDeliveryAddress
                      toggleAddAddressModal={toggleAddAddressModal}
                      userNewDeliveryAddress={userNewDeliveryAddress}
                      selectedAddress={selectedAddress}
                      setSelectedAddress={setSelectedAddress}
                      toggleEditAddressModal={toggleEditAddressModal}
                      openEditAddressModal={openEditAddressModal}
                    />
                  )}

                  <div className="border my-5" />
                  <UserPaymentMethod
                    selectedPaymentMethod={selectedPaymentMethod}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                  />
                </div>

                <div className="border my-5" />
                {cartProducts.map((product, index) => (
                  <CartProductCard
                    key={index}
                    product={product}
                    index={index}
                    setLoading={setLoading}
                    cartDetails={cartDetails}
                    fetchCartProducts={fetchCartProducts}
                  />
                ))}
              </div>

              {/* 📦 Order Summary */}
              <div className="col-span-1">
                <OrderSummary
                  cartProducts={cartDetails}
                  handleNavigate={handleNavigate}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 bg-white rounded-[18px]">
              <p className="text-base font-medium">Your cart is empty.</p>
            </div>
          )}
        </div>
      </div>

      {/* 📦 Address Modals */}
      <AddAddressModal
        openAddAddressModal={openAddAddressModal}
        toggleAddAddressModal={toggleAddAddressModal}
        setUserNewDeliveryAddress={setUserNewDeliveryAddress}
      />
      <EditAddressModal
        openAddAddressModal={openEditAddressModal}
        toggleAddAddressModal={toggleEditAddressModal}
        setUserNewDeliveryAddress={setUserNewDeliveryAddress}
      />
    </div>
  );
};

export default CartSummary;
