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
import AddAddressModal from "./AddAddressModal";
import Cookies from "js-cookie";
import CartProductCard from "./CartProductCard";
import UserDeliveryAddress from "./UserDeliveryAddress";
import UserPaymentMethod from "./UserPaymentMethod";
import { FiArrowLeft } from "react-icons/fi";
import EditAddressModal from "./EditAddressModal";
import { useUser } from "../../context/userContext";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

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

  const { checkIamAlreadyMember } = useUser();
  const { t } = useTranslation("cart");

  const navigate = useNavigate();
  const [openAddAddressModal, setOpenAddAddressModal] = useState(false);
  const [openEditAddressModal, setOpenEditAddressModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    Cookies.get("userSelectedPaymentMethod")
      ? JSON.parse(Cookies.get("userSelectedPaymentMethod"))
      : null,
  );
  const [userNewDeliveryAddress, setUserNewDeliveryAddress] = useState(null);

  const pickupItems = cartProducts?.filter(
    (pr) => pr?.product?.selectedDeliveryMethod === "pickup",
  );
  const deliveryItems = cartProducts?.filter(
    (pr) => pr?.product?.selectedDeliveryMethod === "delivery",
  );

  // Load user’s saved delivery address (from cookies)
  useEffect(() => {
    const savedAddress = Cookies.get("newDeliveryAddress");
    if (savedAddress) {
      setUserNewDeliveryAddress(JSON.parse(savedAddress));
    }
  }, []);

  // Fetch cart data on mount
  useEffect(() => {
    document.title = "Cart - GiveXChange";
    checkIamAlreadyMember();
    fetchCartCount();
    fetchCartProducts();
  }, []);

  const toggleAddAddressModal = () => setOpenAddAddressModal((prev) => !prev);
  const toggleEditAddressModal = () => setOpenEditAddressModal((prev) => !prev);

  // Check if any product requires delivery
  const isAnyDeliveryTypeProduct = cartProducts?.some(
    (p) => p?.product?.selectedDeliveryMethod === "delivery",
  );

  // Remove all cart items
  const removeAllItemsFromCart = async () => {
    checkIamAlreadyMember();
    setLoading(true);
    try {
      const response = await axios.delete(
        `${BASE_URL}/communities/${cartDetails?.communityId}/cart`,
        {
          headers: {
            "Accept-Language": i18n.language,
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      if (response?.data?.success) {
        enqueueSnackbar(response?.data?.message || t(`cartCleared`), {
          variant: "success",
        });
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

  // Proceed to checkout validation
  const handleNavigate = () => {
    const community = JSON.parse(Cookies.get("selected-community"));

    // if (!selectedPaymentMethod) {
    //   return enqueueSnackbar(t(`selectPaymentMethod`), {
    //     variant: "error",
    //   });
    // }
    navigate(`/cart/${community?.id}/checkout`);
  };

  // Loader
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

  // Error UI
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
              {t(`buttons.retry`)}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Normal UI
  return (
    <div className="w-full padding-x relative -top-28">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="text-sm text-white flex items-center gap-2"
      >
        <FiArrowLeft className="text-base" /> {t(`buttons.back`)}
      </button>

      <div className="w-full bg-[var(--light-bg)] rounded-[30px] p-4 mt-5">
        <div className="w-full rounded-[18px]">
          {cartProducts?.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Cart Section */}
              <div className="col-span-1 lg:col-span-2 p-5 lg:p-7 bg-white rounded-[18px] min-h-[70vh]">
                <div className="flex items-center justify-between">
                  <h1 className="text-[24px] font-semibold">{t(`cart`)}</h1>
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
                    <span className="text-sm">{t(`buttons.removeAll`)}</span>
                  </button>
                </div>

                {/* <div className="mb-5">
                  <div className="border my-5" />
                  <UserPaymentMethod
                    selectedPaymentMethod={selectedPaymentMethod}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                  />
                </div> */}

                <div className="border my-5" />
                {pickupItems && pickupItems?.length > 0 && (
                  <div className="w-full">
                    <p className="text-[20px] font-semibold">
                      {t(`pickupItems`)}
                    </p>
                    <div className="border my-5" />
                    <div className="w-full">
                      {pickupItems?.map((product, index) => (
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
                  </div>
                )}

                {deliveryItems && deliveryItems?.length > 0 && (
                  <div className="w-full mt-5">
                    <div className="w-full">
                      {deliveryItems?.map((product, index) => (
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
                  </div>
                )}
              </div>

              <div className="col-span-1">
                <OrderSummary
                  cartProducts={cartDetails}
                  handleNavigate={handleNavigate}
                />
              </div>
            </div>
          ) : (
            <div className="flex gap-2 items-center justify-center min-h-[70vh] text-gray-500 bg-white rounded-[18px]">
              <img
                src="/cart-icon-gray.png"
                alt="cart-icon-gray"
                className="max-w-7"
              />
              <p className="text-base font-medium text-gray-500">
                {t(`cartIsEmpty`)}
              </p>
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
