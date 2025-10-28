import React from "react";

const OrderCancellationReasonModal = ({
  showCancellationReasonPopup,
  setShowCancellationReasonPopup,
  setShowCancellationSuccessPopup,
}) => {
  const handleSubmitReason = () => {
    setShowCancellationReasonPopup(false);
    setShowCancellationSuccessPopup(true);
  };
  return (
    showCancellationReasonPopup && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x">
        <div className="w-full bg-white p-7 rounded-[16px] max-w-[471px] relative">
          <h3 className="text-[24px] font-semibold leading-none">
            Cancel Reason
          </h3>

          <div className="w-full my-4">
            <textarea
              name="cancellationReason"
              id="cancellationReason"
              className="w-full h-[129px] resize-none border border-[#C6C6C6] rounded-[12px] outline-none px-3 py-3"
            ></textarea>
          </div>

          <div className="w-full grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowCancellationReasonPopup(false)}
              className="w-full bg-[#EBEBEB] h-[48px] rounded-[12px] text-center font-medium"
            >
              Not Now
            </button>
            <button
              type="button"
              onClick={() => handleSubmitReason()}
              className="w-full bg-[var(--button-bg)] text-white h-[48px] rounded-[12px] text-center font-medium"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default OrderCancellationReasonModal;
