import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import DeliveryConfirmationPopup from "./DeliveryConfirmationPopup";
import DeliveryProductReviewPopup from "./DeliveryProductReviewPopup";
import FeedbackSuccessPopup from "./FeedbackSuccessPopup";

const PickupItemsList = ({ pickupItems }) => {
  const [showDeliveryConfirmationPopup, setShowDeliveryConfirmationPopup] =
    useState(false);
  const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
  const [showFeedbackSuccessPopup, setShowFeedbackSuccessPopup] =
    useState(false);
  const [product, setProduct] = useState(null);

  return (
    <div className="w-full">
      <h2 className="font-semibold mb-4">Pickup Items</h2>
      {pickupItems &&
        pickupItems?.map((item) => {
          return (
            <div className="w-full">
              <div key={item?.id} className="w-full">
                <div
                  className={`w-full flex items-center justify-between gap-3 ${
                    pickupItems?.length !== 1 &&
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
                      className="w-[148px] h-[48px] bg-[#DEDEDE] rounded-[12px] text-sm font-medium"
                    >
                      Cancel Order
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowDeliveryConfirmationPopup(true)}
                      className="w-[148px] h-[48px] bg-[var(--button-bg)] text-white rounded-[12px] text-sm font-medium"
                    >
                      Confirm Pickup
                    </button>
                  </div>
                </div>
                {item?.deliveryMethod === "pickup" && (
                  <div className="w-full mt-3">
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
              <div className="w-full border border-gray-300 my-4" />
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

export default PickupItemsList;
