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
import { toTitleCase } from "../../utils/toTitleCase";

const DeliveryItemsList = ({
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

  const markItemAsDelivered = async (product) => {
    if (!product) {
      enqueueSnackbar("Something went wrong! Try again.", {
        variant: "error",
      });
      return;
    }

    if (product?.sellerStatus === "cancelled") {
      enqueueSnackbar("This product has been cancelled by the seller.", {
        variant: "error",
        autoHideDuration: 3000,
      });

      return;
    }

    if (product?.sellerStatus !== "out_for_delivery") {
      enqueueSnackbar(
        "You can mark this item as received once the seller marks it out for delivery.",
        {
          variant: "error",
          autoHideDuration: 3500,
        }
      );

      return;
    }

    setDeliveryLoadingState(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/order-items/${product?.id}/delivered`,
        { status: "delivered" },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response?.data?.success) {
        setShowDeliveryConfirmationPopup(true);
        // fetchOrderDetails();
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
      <h2 className="font-semibold mb-4">Delivery Items</h2>
      <div className="w-full">
        {deliveryItems &&
          deliveryItems?.map((item, index) => {
            return (
              <div key={item?.id} className="w-full">
                <div
                  className={`w-full flex items-center justify-between gap-3 ${
                    deliveryItems?.length !== 1 &&
                    index > 0 &&
                    `mt-4 pt-4 border-t-2 border-gray-300`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="">
                      {/* public/image-placeholder.png */}
                      {item?.productImage ? (
                        <img
                          src={item?.productImage}
                          alt="denim jacket"
                          className="min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] rounded-[16px]"
                        />
                      ) : (
                        <img
                          src={`/image-placeholder.png`}
                          alt="denim jacket"
                          className="min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px] rounded-[16px]"
                        />
                      )}
                    </div>
                    <div className="flex flex-col items-start gap-1 justify-center">
                      <p className="font-semibold leading-none">
                        {item?.productTitle}
                      </p>
                      <div>
                        <p
                          className={`text-sm font-medium mt-1 ${
                            item?.overallStatus === "completed"
                              ? "text-green-500"
                              : item?.overallStatus === "cancelled"
                              ? "text-red-500"
                              : item?.overallStatus === "in_progress"
                              ? "text-[#FF7700]"
                              : item?.overallStatus === "pending"
                              ? "text-[#FF7700]"
                              : item?.overallStatus === "delivered"
                              ? "text-green-500"
                              : "text-gray-500"
                          }`}
                        >
                          {toTitleCase(item?.overallStatus)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full max-w-[370px] flex items-center justify-end">
                    {item?.buyerStatus === "delivered" ||
                    item?.buyerStatus === "cancelled" ||
                    item?.sellerStatus === "cancelled" ? (
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
                    ) : (
                      <div className="max-w-[370px] flex items-center justify-end gap-2 justify-end">
                        {/* <button
                          type="button"
                          onClick={() => {
                            setProduct(item);
                            setShowOrderCancelPopup(true);
                          }}
                          disabled={
                            item?.buyerStatus === "picked_up" ||
                            item?.buyerStatus === "delivered" ||
                            item?.buyerStatus === "cancelled" ||
                            item?.sellerStatus === "cancelled" ||
                            item?.sellerStatus === "out_for_delivery" ||
                            item?.sellerStatus === "ready_for_pickup" ||
                            item?.sellerStatus === "ready"
                          }
                          className="w-[148px] h-[48px] bg-[#DEDEDE] rounded-[12px] text-sm font-medium"
                        >
                          Cancel Order
                        </button> */}
                        <button
                          type="button"
                          onClick={() => {
                            setProduct(item);
                            markItemAsDelivered(item);
                          }}
                          // disabled={item?.sellerStatus !== "out_for_delivery"}
                          disabled={deliveryLoadingState}
                          className="w-[148px] h-[48px] bg-[var(--button-bg)] text-white rounded-[12px] text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {deliveryLoadingState ? (
                            <Loader />
                          ) : (
                            "Mark As Received"
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="w-full border border-gray-300 my-4" />
                {item?.deliveryAddress && (
                  <div className="w-full mt-3">
                    <h3 className="text-sm font-semibold leading-none">
                      Delivery Address
                    </h3>
                  </div>
                )}
                <div className="w-full">
                  <h3 className="font-semibold leading-none">Vendor Details</h3>
                  <div className="w-full flex items-center justify-between">
                    <div className="w-full flex items-center gap-3 mt-3">
                      <div className="">
                        <img
                          src={
                            item?.seller?.profilePictureUrl
                              ? item?.seller?.profilePictureUrl
                              : "/profile-icon.png"
                          }
                          alt=""
                          className="w-[80px] h-[80px] rounded-full"
                        />
                      </div>
                      <div className="flex flex-col items-start justify-center gap-2">
                        <p className="text-lg font-semibold leading-none">
                          {item?.seller?.name}
                        </p>
                        <p className="text-[15px] font-normal text-[#18181899] leading-none">
                          {item?.seller?.email}
                        </p>
                      </div>
                    </div>
                    <Link
                      to={`/orders/details/seller/${orderDetails?.communityId}/${item?.seller?.id}`}
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

                {item?.cancellation_reason && (
                  <div className="w-full">
                    <div className="w-full border border-gray-300 my-4" />
                    <h3 className="font-semibold leading-none">
                      Cancellation Reason
                    </h3>
                    <p className="font-normal leading-[1.2] mt-1 break-words">
                      {item?.cancellation_reason}
                    </p>
                  </div>
                )}
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
        fetchOrderDetails={fetchOrderDetails}
      />
      <DeliveryProductReviewPopup
        openFeedbackModal={openFeedbackModal}
        setOpenFeedbackModal={setOpenFeedbackModal}
        setShowFeedbackSuccessPopup={setShowFeedbackSuccessPopup}
        product={product}
        fetchOrderDetails={fetchOrderDetails}
      />
      <FeedbackSuccessPopup
        showFeedbackSuccessPopup={showFeedbackSuccessPopup}
        setShowFeedbackSuccessPopup={setShowFeedbackSuccessPopup}
        fetchOrderDetails={fetchOrderDetails}
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
        fetchOrderDetails={fetchOrderDetails}
        product={product}
      />
      <CancelOrderSuccessPopup
        showCancellationSuccessPopup={showCancellationSuccessPopup}
        setShowCancellationSuccessPopup={setShowCancellationSuccessPopup}
        fetchOrderDetails={fetchOrderDetails}
      />
    </div>
  );
};

export default DeliveryItemsList;
