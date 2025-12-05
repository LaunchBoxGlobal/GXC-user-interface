import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { Link, useNavigate } from "react-router-dom";
import DeliveryConfirmationPopup from "./DeliveryConfirmationPopup";
import DeliveryProductReviewPopup from "./DeliveryProductReviewPopup";
import FeedbackSuccessPopup from "./FeedbackSuccessPopup";
import { useState } from "react";
import CancelConfirmationPopup from "./CancelConfirmationPopup";
import OrderCancellationReasonModal from "./OrderCancellationReasonModal";
import CancelOrderSuccessPopup from "./CancelOrderSuccessPopup";
import { enqueueSnackbar } from "notistack";
import Loader from "../../components/Common/Loader";
import { FaLocationDot } from "react-icons/fa6";
import { toTitleCase } from "../../utils/toTitleCase";

const SellerDeliveryItemsList = ({
  deliveryItems,
  fetchOrderDetails,
  orderDetails,
}) => {
  const [showDeliveryConfirmationPopup, setShowDeliveryConfirmationPopup] =
    useState(false);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [showFeedbackSuccessPopup, setShowFeedbackSuccessPopup] =
    useState(false);
  const [product, setProduct] = useState(null);
  // cancel order states
  const [showOrderCancelPopup, setShowOrderCancelPopup] = useState(false);
  const [showCancellationReasonPopup, setShowCancellationReasonPopup] =
    useState(false);
  const [showCancellationSuccessPopup, setShowCancellationSuccessPopup] =
    useState(false);
  const [deliveryLoadingState, setDeliveryLoadingState] = useState(false);

  const navigate = useNavigate();

  const markItemAsDelivered = async (productId) => {
    if (!productId) {
      enqueueSnackbar("Something went wrong! Try again.", {
        variant: "error",
      });
      return;
    }

    setDeliveryLoadingState(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/order-items/${productId}/delivered`,
        { status: "delivered" },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response?.data?.success) {
        setShowDeliveryConfirmationPopup(true);
        fetchOrderDetails();
      }
    } catch (error) {
      console.error("markItemAsDelivered error >>> ", error);
      handleApiError(error, navigate);
    } finally {
      setDeliveryLoadingState(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="font-semibold mb-4">Pickup Items</h2>
      <div className="w-full">
        {deliveryItems &&
          deliveryItems?.map((item) => {
            return (
              <div key={item?.id} className="w-full">
                <div
                  className={`w-full flex items-center justify-between gap-3 ${
                    deliveryItems?.length !== 1 &&
                    `border-b-2 border-gray-300 pb-4`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="">
                      <img
                        src={item?.productImage}
                        alt="denim jacket"
                        className="min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] rounded-[16px]"
                      />
                    </div>
                    <div className="flex flex-col items-start gap-1 justify-center">
                      <p className="font-semibold leading-none">
                        {item?.productTitle}
                      </p>
                      <div>
                        <p
                          className={`text-xs font-medium ${
                            item?.overallStatus == "cancelled"
                              ? "text-red-500"
                              : item?.overallStatus === "pending"
                              ? "text-[#FF7700]"
                              : item?.overallStatus === "in_progress"
                              ? "text-[#FF7700]"
                              : item?.overallStatus === "completed"
                              ? "text-green-500"
                              : item?.overallStatus === "ready" ||
                                item?.overallStatus === "ready_for_pickup" ||
                                item?.overallStatus === "out_for_delivery"
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {toTitleCase(item?.overallStatus)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/products/${item?.productTitle}?productId=${item?.productId}`}
                    className="max-w-[38px]"
                  >
                    <div className="w-[38px] max-w-[38px] h-[38px] rounded-[11px] flex items-center justify-center bg-[var(--button-bg)]">
                      <img
                        src="/right-arrow-icon.png"
                        alt=""
                        className="w-[7px] h-[14px]"
                      />
                    </div>
                  </Link>
                </div>

                {item?.deliveryMethod === "delivery" && (
                  <div className="w-full mt-5">
                    <h3 className="text-sm font-semibold leading-none">
                      Pickup Address
                    </h3>

                    <div className="w-full flex items-center gap-2 mt-1">
                      <div className="min-w-4">
                        <FaLocationDot className="text-lg text-[var(--button-bg)]" />
                      </div>
                      <p>{item?.communityPickupAddress?.address}</p>
                    </div>
                  </div>
                )}
                <div className="w-full border border-gray-300 my-4" />

                <div className="w-full">
                  <h3 className="font-semibold leading-none">
                    Customer Details
                  </h3>
                  <div className="w-full flex items-center justify-between">
                    <div className="w-full flex items-center gap-3 mt-3">
                      <div className="">
                        <img
                          src={
                            orderDetails?.buyer?.profilePictureUrl
                              ? orderDetails?.buyer?.profilePictureUrl
                              : "/profile-icon.png"
                          }
                          alt=""
                          className="w-[80px] h-[80px] rounded-full"
                        />
                      </div>
                      <div className="flex flex-col items-start justify-center gap-2">
                        <p className="text-lg font-semibold leading-none">
                          {orderDetails?.buyer?.name}
                        </p>
                        <p className="text-[15px] font-normal text-[#18181899] leading-none">
                          {orderDetails?.buyer?.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/order-management/details/seller/${orderDetails?.communityId}/${orderDetails?.buyer?.id}?isBuyer=true`}
                      className="max-w-[38px]"
                    >
                      <div className="w-[38px] max-w-[38px] h-[38px] rounded-[11px] flex items-center justify-center bg-[var(--button-bg)]">
                        <img
                          src="/right-arrow-icon.png"
                          alt=""
                          className="w-[7px] h-[14px]"
                        />
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      <DeliveryConfirmationPopup
        showDeliveryConfirmationPopup={showDeliveryConfirmationPopup}
        setShowDeliveryConfirmationPopup={setShowDeliveryConfirmationPopup}
        setOpenFeedbackModal={setOpenFeedbackModal}
        title={"delivered"}
        type={"delivery"}
      />
      <DeliveryProductReviewPopup
        openFeedbackModal={openFeedbackModal}
        setOpenFeedbackModal={setOpenFeedbackModal}
        setShowFeedbackSuccessPopup={setShowFeedbackSuccessPopup}
        product={product}
      />
      <FeedbackSuccessPopup
        showFeedbackSuccessPopup={showFeedbackSuccessPopup}
        setShowFeedbackSuccessPopup={setShowFeedbackSuccessPopup}
      />

      <CancelConfirmationPopup
        showOrderCancelPopup={showOrderCancelPopup}
        setShowOrderCancelPopup={setShowOrderCancelPopup}
        setShowCancellationSuccessPopup={setShowCancellationSuccessPopup}
        setShowCancellationReasonPopup={setShowCancellationReasonPopup}
      />

      <OrderCancellationReasonModal
        showCancellationReasonPopup={showCancellationReasonPopup}
        setShowCancellationReasonPopup={setShowCancellationReasonPopup}
        setShowCancellationSuccessPopup={setShowCancellationSuccessPopup}
      />
      <CancelOrderSuccessPopup
        showCancellationSuccessPopup={showCancellationSuccessPopup}
        setShowCancellationSuccessPopup={setShowCancellationSuccessPopup}
      />
    </div>
  );
};

export default SellerDeliveryItemsList;
