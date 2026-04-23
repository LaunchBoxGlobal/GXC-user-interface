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
import Cookies from "js-cookie";
import { FiArrowLeft } from "react-icons/fi";
import OrderSuccessPopup from "./OrderSuccessPopup";
import { FaLocationDot } from "react-icons/fa6";
import { useUser } from "../../context/userContext";
import { useAppContext } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import UserPaymentMethod from "./UserPaymentMethod";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

import {
  createSetupIntent,
  confirmSetupIntent,
  confirmOneTimePayment,
} from "./stripeService";
import Loading from "./Loading";
import CheckoutError from "./CheckoutError";

const Checkout = () => {
  const {
    fetchCartCount,
    fetchCartProducts,
    cartProducts,
    setCartProducts,
    cartDetails,
  } = useCart();

  const { selectedCommunity, checkIamAlreadyMember } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAppContext();

  const [removingItems, setRemovingItems] = useState(false);

  const isAnyDeliveryTypeProduct = cartProducts?.some(
    (p) => p?.product?.selectedDeliveryMethod === "delivery",
  );

  const ids = cartProducts?.map((p) => p?.product?.id);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const savedAddress = Cookies.get("userSelectedDeliveryAddress")
    ? JSON.parse(Cookies.get("userSelectedDeliveryAddress"))
    : null;
  const savedPaymentMethod = Cookies.get("userSelectedPaymentMethod")
    ? JSON.parse(Cookies.get("userSelectedPaymentMethod"))
    : null;
  const [ShowOrderPlacePopup, setShowOrderPlacePopup] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const [saveCard, setSaveCard] = useState(false);

  const handleCloseSuccessPopup = () => {
    setShowOrderPlacePopup((prev) => !prev);
  };

  const stripe = useStripe();
  const elements = useElements();

  const { t } = useTranslation("cart");

  useEffect(() => {
    document.title = "Checkout - GiveXChange";
    checkIamAlreadyMember();
    fetchCartCount();
    fetchCartProducts();
  }, []);

  useEffect(() => {
    if (cartProducts?.length <= 0) {
      navigate("/");
      enqueueSnackbar(
        t("No items in your cart! Product is no longer available."),
        {
          variant: "error",
        },
      );
    }
  }, [cartProducts, navigate]);

  const pickupItems = cartProducts?.filter(
    (pr) => pr?.product?.selectedDeliveryMethod === "pickup",
  );
  const deliveryItems = cartProducts?.filter(
    (pr) => pr?.product?.selectedDeliveryMethod === "delivery",
  );

  const handleNavigate = () => {
    if (!selectedPaymentMethod) {
      enqueueSnackbar(t("Please select a payment method!"), {
        variant: "error",
      });
      return;
    }
    navigate(`/cart/${selectedCommunity?.id}/checkout`);
  };

  const deleteAllCartItems = async () => {
    await axios.delete(
      `${BASE_URL}/communities/${cartDetails?.communityId}/cart`,
      {
        headers: {
          "Accept-Language": i18n.language,
          Authorization: `Bearer ${getToken()}`,
        },
      },
    );
  };

  const handlePlaceOrder = async () => {
    const cardElement = elements.getElement(CardElement);

    if (!selectedPaymentMethod?.id && !cardElement) {
      enqueueSnackbar(
        t("Please select a saved card or enter new card details"),
        {
          variant: "error",
        },
      );
      return;
    }

    if (!stripe || !elements) {
      enqueueSnackbar("Stripe not initialized", { variant: "error" });
      return;
    }

    if (!ids || ids.length === 0) {
      enqueueSnackbar("Cart is empty", { variant: "error" });
      return;
    }

    setRemovingItems(true);

    try {
      let paymentMethodId = null;

      /**
       * ============================
       * CASE 1: USER SELECTED SAVED CARD
       * ============================
       */
      if (selectedPaymentMethod?.id) {
        paymentMethodId = selectedPaymentMethod.id;
      } else if (saveCard) {
        /**
         * ============================
         * CASE 2: NEW CARD + SAVE CARD
         * ============================
         */
        const clientSecret = await createSetupIntent();

        paymentMethodId = await confirmSetupIntent(
          stripe,
          elements,
          user,
          clientSecret,
        );
      } else {
        /**
         * ============================
         * CASE 2: NEW CARD + ONE TIME PAYMENT
         * ============================
         */
        const paymentMethod = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
        });

        if (!paymentMethod || !paymentMethod?.paymentMethod?.id) {
          enqueueSnackbar("Please add or select your payment method.", {
            variant: "error",
          });
          return;
        }

        paymentMethodId = paymentMethod.paymentMethod.id;
      }

      /**
       * ============================
       * CALL CHECKOUT API
       * ============================
       */
      if (!paymentMethodId) {
        enqueueSnackbar("Please add or select your payment method.", {
          variant: "error",
        });
        return;
      }
      const response = await axios.post(
        `${BASE_URL}/communities/${cartDetails?.communityId}/checkout`,
        {
          productIds: ids,
          paymentMethodId,
          deliveryAddress: user?.address || "",
          deliveryCity: user?.city || "",
          deliveryState: user?.state || "",
          deliveryZipcode: user?.zipcode || "",
          deliveryCountry: user?.country || "",
        },
        {
          headers: {
            "Accept-Language": i18n.language,
            Authorization: `Bearer ${getToken()}`,
          },
        },
      );

      /**
       * ============================
       * SUCCESS FLOW
       * ============================
       */
      if (response?.data?.success) {
        setOrderId(response?.data?.data?.orderNumber);

        await deleteAllCartItems();
        fetchCartCount();
        setCartProducts(null);

        Cookies.remove("userSelectedPaymentMethod");
        Cookies.remove("userSelectedDeliveryAddress");

        setShowOrderPlacePopup(true);
      }
    } catch (error) {
      console.error(error);

      // enqueueSnackbar(error?.message || error || "Payment failed. Please try again.", {
      //   variant: "error",
      // });
      handleApiError(error, navigate);
    } finally {
      setRemovingItems(false);
    }
  };

  if (loading) return <Loading />;

  if (error)
    return (
      <CheckoutError
        t={t}
        error={error}
        fetchCartProducts={fetchCartProducts}
      />
    );

  const handleNavigateBack = () => {
    if (cartProducts) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-28">
      <div className="w-full">
        <button
          type="button"
          onClick={() => handleNavigateBack()}
          className="text-sm text-white flex items-center gap-2"
        >
          <FiArrowLeft className="text-base" /> {t(`buttons.back`)}
        </button>
      </div>
      <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-5">
        <div className="w-full rounded-[18px] relative">
          {cartProducts && cartProducts?.length > 0 ? (
            <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="w-full col-span-2 p-5 lg:p-7 bg-white rounded-[18px] min-h-[70vh]">
                <div className="w-full flex items-center justify-between">
                  <h1 className="text-[24px] font-semibold leading-none">
                    {t(`checkout`)}
                  </h1>
                </div>

                <div className="w-full border my-5" />

                <>
                  <UserPaymentMethod
                    selectedPaymentMethod={selectedPaymentMethod}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                    saveCard={saveCard}
                    setSaveCard={setSaveCard}
                  />
                  <div className="w-full border my-5" />
                </>

                {/* user address + payment method */}
                <div className="w-full mb-5">
                  {/* User selected delivery address */}
                  {isAnyDeliveryTypeProduct && savedAddress && (
                    <>
                      <div className="w-full">
                        <p className="font-semibold leading-none">
                          {t(`deliveryAddress`)}
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
                    </>
                  )}
                </div>

                {cartProducts && pickupItems && pickupItems?.length > 0 && (
                  <div className="w-full">
                    <p className="text-[20px] font-semibold">
                      {t(`pickupItems`)}
                    </p>
                    <div className="border my-5" />
                    {pickupItems?.map((product, index) => (
                      <div
                        className={`w-full border-b ${
                          index === 0 ? "pb-5" : "pt-5 pb-3"
                        }`}
                        key={index}
                      >
                        <div
                          className={`w-full flex items-center justify-between`}
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
                                  ? `${product?.product?.title?.slice(
                                      0,
                                      30,
                                    )}...`
                                  : product?.product?.title}
                              </p>
                              <p className="font-normal text-[#7B7B7B] leading-none text-xs lg:text-base">
                                {product?.product?.selectedDeliveryMethod ===
                                "pickup"
                                  ? "Pickup"
                                  : product?.product?.selectedDeliveryMethod ===
                                      "delivery"
                                    ? "Delivery"
                                    : ""}
                              </p>
                              <div className="w-full lg:hidden flex items-end justify-between">
                                <div className="flex flex-col items-start justify-center gap-0 col-span-4">
                                  <p className="font-normal text-[#7B7B7B] leading-none text-xs lg:text-sm">
                                    {t(`price`)}
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
                          <div className="hidden lg:flex flex-col items-end justify-center gap-2 col-span-4 lg:col-span-1">
                            <p className="font-normal text-[#7B7B7B] leading-none text-sm">
                              {t(`price`)}
                            </p>
                            <p className="font-semibold text-[20px] leading-none">
                              ${product?.product?.price}
                            </p>
                          </div>
                        </div>
                        {product?.product?.selectedDeliveryMethod ===
                          "pickup" &&
                          product?.product?.pickupAddress && (
                            <div className="flex flex-col items-start justify-start gap-1 mt-3">
                              <p className="text-sm font-semibold">
                                {t(`pickupAddress`)}:{" "}
                              </p>
                              <div className="flex items-center gap-2">
                                <FaLocationDot className="min-w-3 text-base text-[var(--button-bg)]" />
                                <p className="text-sm">
                                  {product?.product?.pickupAddress}
                                </p>
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}

                {cartProducts && deliveryItems && deliveryItems?.length > 0 && (
                  <div className="w-full mt-5">
                    {deliveryItems?.map((product, index) => (
                      <div
                        className={`w-full border-b ${
                          index === 0 ? "pb-5" : "pt-5 pb-3"
                        }`}
                        key={index}
                      >
                        <div
                          className={`w-full flex items-center justify-between`}
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
                                  ? `${product?.product?.title?.slice(
                                      0,
                                      30,
                                    )}...`
                                  : product?.product?.title}
                              </p>
                              <p className="font-normal text-[#7B7B7B] leading-none text-xs lg:text-base">
                                {product?.product?.selectedDeliveryMethod ===
                                "pickup"
                                  ? "Pickup"
                                  : product?.product?.selectedDeliveryMethod ===
                                      "delivery"
                                    ? "Community Pickup"
                                    : ""}
                              </p>
                              <div className="w-full lg:hidden flex items-end justify-between">
                                <div className="flex flex-col items-start justify-center gap-0 col-span-4">
                                  <p className="font-normal text-[#7B7B7B] leading-none text-xs lg:text-sm">
                                    {t(`price`)}
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
                          <div className="hidden lg:flex flex-col items-end justify-center gap-2 col-span-4 lg:col-span-1">
                            <p className="font-normal text-[#7B7B7B] leading-none text-sm">
                              {t(`price`)}
                            </p>
                            <p className="font-semibold text-[20px] leading-none">
                              ${product?.product?.price}
                            </p>
                          </div>
                        </div>
                        {product?.product?.selectedDeliveryMethod ===
                          "delivery" &&
                          product?.product?.communityPickupAddress && (
                            <div className="flex flex-col items-start justify-start gap-1 mt-3">
                              <p className="text-sm font-semibold">
                                {t(`pickupAddress`)}:{" "}
                              </p>
                              <div className="flex items-center gap-2">
                                <FaLocationDot className="min-w-3 text-base text-[var(--button-bg)]" />
                                <p className="text-sm">
                                  {product?.product?.communityPickupAddress}
                                </p>
                              </div>
                            </div>
                          )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="col-span-1 w-full">
                <OrderSummary
                  cartProducts={cartDetails}
                  navigate={navigate}
                  handleNavigate={handleNavigate}
                  handlePlaceOrder={handlePlaceOrder}
                  removingItems={removingItems}
                />
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center justify-center min-h-[50vh] text-gray-500 bg-white rounded-[18px]">
              <p className="text-base font-medium">{t(`cartIsEmpty`)}</p>
            </div>
          )}
        </div>
      </div>

      <OrderSuccessPopup
        handleCloseSuccessPopup={handleCloseSuccessPopup}
        ShowOrderPlacePopup={ShowOrderPlacePopup}
        orderId={orderId}
      />
    </div>
  );
};

export default Checkout;
