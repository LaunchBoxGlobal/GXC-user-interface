const DeliverySuccessPopup = ({ showSuccessModal, setShowSuccessModal }) => {
  return (
    showSuccessModal && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x">
        <div className="w-full bg-white max-w-[471px] rounded-[32px] p-7 text-center space-y-3">
          <div className="w-[122px] h-[122px] flex items-center justify-center bg-[var(--button-bg)] rounded-full mx-auto">
            <img
              src="/out-for-delivery-popup-icon.png"
              alt="out-for-delivery-popup-icon"
              className="w-[63px] h-[43px]"
            />
          </div>
          <h4 className="text-[24px] font-semibold leading-none text-center">
            Marked as out for delivery
          </h4>
          <p className="text-[#565656] text-sm leading-[1.2]">
            You’ve successfully updated the order status.
          </p>

          <div className="w-full pt-2">
            <button
              type="button"
              onClick={() => {
                setShowSuccessModal(false);
              }}
              className="bg-[var(--button-bg)] font-medium w-full h-[48px] rounded-[12px] text-center text-white"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default DeliverySuccessPopup;
