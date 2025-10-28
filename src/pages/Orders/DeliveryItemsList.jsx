import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from "react-router-dom";
import DeliveryConfirmationPopup from "./DeliveryConfirmationPopup";
import DeliveryProductReviewPopup from "./DeliveryProductReviewPopup";
import FeedbackSuccessPopup from "./FeedbackSuccessPopup";
import { useState } from "react";
import CancelConfirmationPopup from "./CancelConfirmationPopup";
import OrderCancellationReasonModal from "./OrderCancellationReasonModal";
import CancelOrderSuccessPopup from "./CancelOrderSuccessPopup";

const DeliveryItemsList = ({ deliveryItems, orderItemId }) => {
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

  const navigate = useNavigate();

  const markAsDelivered = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/order-items/${orderItemId}/delivered`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      console.log();
    } catch (error) {
      handleApiError(error, navigate);
    }
  };

  return (
    <div className="w-full">
      <h2 className="font-semibold mb-4">Delivery Items</h2>
      <div className="w-full">
        {deliveryItems &&
          deliveryItems?.map((item) => {
            return (
              <div className="w-full">
                <div
                  key={item?.id}
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
                      <p className="text-gray-600">
                        {item?.buyerStatus === "in_progress"
                          ? "In Progress"
                          : item?.buyerStatus === "delivered"
                          ? "Delivered"
                          : item?.buyerStatus === "cancelled"
                          ? "Cancelled"
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="max-w-[370px] flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setShowOrderCancelPopup(true)}
                      className="w-[148px] h-[48px] bg-[#DEDEDE] rounded-[12px] text-sm font-medium"
                    >
                      Cancel Order
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeliveryConfirmationPopup(true);
                        setProduct(item);
                      }}
                      className="w-[148px] h-[48px] bg-[var(--button-bg)] text-white rounded-[12px] text-sm font-medium"
                    >
                      Mark As Received
                    </button>
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
                  <div className="w-full flex items-center gap-3 mt-3">
                    <div className="">
                      <img
                        src={
                          item?.seller?.profilePictureUrl
                            ? item?.seller?.profilePictureUrl
                            : "/profile-icon.png"
                        }
                        alt=""
                        className="w-[80px] h-[80px]"
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

export default DeliveryItemsList;
