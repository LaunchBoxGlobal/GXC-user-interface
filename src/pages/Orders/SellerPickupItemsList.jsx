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
import { toTitleCase } from "../../utils/toTitleCase";

const SellerPickupItemsList = ({
  pickupItems,
  fetchOrderDetails,
  orderDetails,
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

  const markItemAsPickupedUp = async (productId) => {
    if (!productId) {
      enqueueSnackbar("Something went wrong! Try again.", {
        variant: "error",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${BASE_URL}/order-items/${productId}/delivered`,
        { status: "picked_up" },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response?.data?.success) {
        fetchOrderDetails();
        setShowDeliveryConfirmationPopup(true);
      }
    } catch (error) {
      console.error("markItemAsDelivered error >>> ", error);
      enqueueSnackbar(
        error?.message ||
          error?.response?.data?.message ||
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

  return (
    <div className="w-full">
      <h2 className="font-semibold mb-4">Pickup Items</h2>
      <div className="w-full space-y-5">
        {pickupItems &&
          pickupItems?.map((item) => {
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
                    {user?.id === item?.seller?.id ? (
                      <div className="max-w-[370px] flex items-center gap-2 justify-end">
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
                    ) : (
                      <div className="max-w-[370px] flex items-center gap-2 justify-end">
                        {item?.buyerStatus === "picked_up" ? (
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
                          <>
                            {/* <button
                              type="button"
                              disabled={item?.buyerStatus === "cancelled"}
                              className="w-[148px] h-[48px] bg-[#DEDEDE] rounded-[12px] text-sm font-medium"
                            >
                              Cancel Order
                            </button> */}
                            <button
                              type="button"
                              onClick={() => {
                                setProduct(item);
                                setLoadingItemId(item?.id);
                                markItemAsPickupedUp(item?.id);
                              }}
                              disabled={loadingItemId === item?.id}
                              className="w-[148px] h-[48px] bg-[var(--button-bg)] text-white rounded-[12px] text-sm font-medium"
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
                  {item?.deliveryMethod === "pickup" && (
                    <div className="w-full mt-4">
                      <h3 className="text-base font-semibold leading-none">
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

                {/* {user && user?.id !== item?.seller?.id && ( */}
                <>
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
                        to={`/orders/details/seller/${orderDetails?.communityId}/${orderDetails?.buyer?.id}?isBuyer=true`}
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
                </>
                {/* )} */}
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
    </div>
  );
};

export default SellerPickupItemsList;
