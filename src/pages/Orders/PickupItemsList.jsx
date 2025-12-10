import { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import DeliveryConfirmationPopup from "./DeliveryConfirmationPopup";
import DeliveryProductReviewPopup from "./DeliveryProductReviewPopup";
import FeedbackSuccessPopup from "./FeedbackSuccessPopup";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { enqueueSnackbar } from "notistack";
import Loader from "../../components/Common/Loader";
import { Link } from "react-router-dom";
import { useUser } from "../../context/userContext";
import { useAppContext } from "../../context/AppContext";
import CancelConfirmationPopup from "./CancelConfirmationPopup";
import OrderCancellationReasonModal from "./OrderCancellationReasonModal";
import CancelOrderSuccessPopup from "./CancelOrderSuccessPopup";
import { toTitleCase } from "../../utils/toTitleCase";

const PickupItemsList = ({
  pickupItems,
  fetchOrderDetails,
  orderDetails,
  setOpenMissingItemReportModal,
  setMissingItem,
}) => {
  const [showDeliveryConfirmationPopup, setShowDeliveryConfirmationPopup] =
    useState(false);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [showFeedbackSuccessPopup, setShowFeedbackSuccessPopup] =
    useState(false);
  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingItemId, setLoadingItemId] = useState(null);
  const { user } = useAppContext();

  const markItemAsPickupedUp = async (item) => {
    if (!item?.id) {
      enqueueSnackbar("Something went wrong! Try again.", {
        variant: "error",
      });

      setLoadingItemId(null);
      return;
    }

    if (item?.sellerStatus === "cancelled") {
      enqueueSnackbar("This product has been cancelled by the seller.", {
        variant: "error",
        autoHideDuration: 3000,
      });
      setLoadingItemId(null);
      return;
    }

    setLoading(true);
    setLoadingItemId(item?.id);
    try {
      const response = await axios.put(
        `${BASE_URL}/order-items/${item?.id}/delivered`,
        { status: "picked_up" },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response?.data?.success) {
        setShowDeliveryConfirmationPopup(true);
      }
    } catch (error) {
      // console.error("markItemAsDelivered error >>> ", error);
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong.",
        {
          variant: "error",
        }
      );
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
      setLoadingItemId(null);
    }
  };

  const [showOrderCancelPopup, setShowOrderCancelPopup] = useState(false);
  const [showCancellationSuccessPopup, setShowCancellationSuccessPopup] =
    useState(false);
  const [showCancellationReasonPopup, setShowCancellationReasonPopup] =
    useState(false);
  // const [showOrderCancelPopup, setShowOrderCancelPopup] = useState(false)

  console.log("eofineoin");
  return (
    <div className="w-full">
      <h2 className="font-semibold mb-4">Pickup Items</h2>
      <div className="w-full space-y-5">
        {pickupItems &&
          pickupItems?.map((item) => {
            console.log(item);
            return (
              <div
                key={item?.id}
                className={`w-full ${
                  pickupItems?.length !== 1 && `border-b-2 border-gray-300 pb-4`
                }`}
              >
                <div className="w-full">
                  <div
                    className={`w-full flex items-center justify-between gap-3 `}
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
                          {item?.productTitle?.length > 40
                            ? `${item?.productTitle?.slice(0, 25)}...`
                            : item?.productTitle}
                        </p>
                        <div>
                          <p
                            className={`text-sm font-medium ${
                              item?.overallStatus === "completed" ||
                              item?.overallStatus === "ready"
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
                        {item?.report?.submitted &&
                          item?.overallStatus !== "completed" && (
                            <p
                              className={`font-medium leading-none text-sm ${
                                item?.report?.status === "pending"
                                  ? "text-[#FF7700]"
                                  : item?.report?.status === "resolved"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {item?.report?.status === "pending"
                                ? "Dispute Raised – Under Review"
                                : item?.report?.status === "resolved"
                                ? "Resolved"
                                : item?.report?.status === "rejected"
                                ? "Rejected"
                                : ""}
                              {/* {item?.report?.status.charAt(0).toUpperCase() +
                              item?.report?.status.slice(1)} */}
                            </p>
                          )}
                      </div>
                    </div>
                    {user?.id === item?.seller?.id ? (
                      <div className="max-w-[370px] flex items-center gap-2 justify-end">
                        <Link
                          to={`/order-management/details/seller/${orderDetails?.communityId}/${item?.seller?.id}`}
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
                    ) : (
                      <div className="max-w-[370px] flex items-center gap-2 justify-end">
                        {item?.reviewSubmitted == false &&
                          item?.sellerStatus === "completed" && (
                            <button
                              type="button"
                              className="bg-[var(--button-bg)] text-white h-[48px] rounded-[11px] text-sm font-medium px-6"
                              onClick={() => {
                                setProduct(item);
                                setOpenFeedbackModal(true);
                              }}
                            >
                              Write a review
                            </button>
                          )}
                        {item?.buyerStatus === "picked_up" ||
                        item?.buyerStatus === "cancelled" ||
                        item?.sellerStatus === "cancelled" ? (
                          <Link
                            to={`/products/${item?.productTitle}?productId=${item?.productId}&?isOrderPlaced=true`}
                            className="max-w-[48px]"
                          >
                            <div className="w-[48px] max-w-[48px] h-[48px] rounded-[11px] flex items-center justify-center bg-[var(--button-bg)]">
                              <img
                                src="/right-arrow-icon.png"
                                alt=""
                                className="w-[7px] h-[14px]"
                              />
                            </div>
                          </Link>
                        ) : (
                          <>
                            {(item?.sellerStatus === "out_for_delivery" ||
                              item?.sellerStatus === "ready_for_pickup") &&
                              !item?.report?.submitted && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMissingItem(item);
                                    setOpenMissingItemReportModal(true);
                                  }}
                                  className="w-[148px] h-[48px] bg-[var(--button-bg)] text-white rounded-[12px] text-sm font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                  Mark As Missing
                                </button>
                              )}
                            <button
                              type="button"
                              onClick={() => {
                                setProduct(item);
                                markItemAsPickupedUp(item);
                                // setLoadingItemId(item?.id);
                              }}
                              disabled={loadingItemId === item?.id}
                              className="w-[148px] h-[48px] bg-[var(--button-bg)] text-white rounded-[12px] text-sm font-medium disabled:bg-opacity-70 disabled:cursor-not-allowed"
                            >
                              {loadingItemId === item?.id ? (
                                <Loader />
                              ) : (
                                "Confirm Pickup"
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  {item?.deliveryMethod === "pickup" &&
                    user &&
                    user?.id !== item?.seller?.id && (
                      <div className="w-full mt-4">
                        <h3 className="text-sm font-semibold leading-none">
                          Pickup Address
                        </h3>
                        <div className="w-full flex items-center gap-2 mt-1">
                          <div className="min-w-4">
                            <FaLocationDot className="text-lg text-[var(--button-bg)]" />
                          </div>
                          <p>
                            {[
                              item?.pickupAddress?.address,
                              item?.pickupAddress?.city,
                              item?.pickupAddress?.state,
                              item?.pickupAddress?.zipcode,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        </div>
                      </div>
                    )}
                </div>

                {user && user?.id !== item?.seller?.id && (
                  <>
                    <div className="w-full border border-gray-300 my-4" />
                    <div className="w-full">
                      <h3 className="font-semibold leading-none">
                        Vendor Details
                      </h3>
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
                          to={`/order-management/details/seller/${orderDetails?.communityId}/${item?.seller?.id}?isOrderPlaced=true`}
                          className="max-w-[48px]"
                        >
                          <div className="w-[48px] max-w-[48px] h-[48px] rounded-[11px] flex items-center justify-center bg-[var(--button-bg)]">
                            <img
                              src="/right-arrow-icon.png"
                              alt=""
                              className="w-[7px] h-[14px]"
                            />
                          </div>
                        </Link>
                      </div>
                    </div>
                  </>
                )}

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
        title={"pickup"}
        type={"pickup"}
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

      {/* cancellation modals */}
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

export default PickupItemsList;
