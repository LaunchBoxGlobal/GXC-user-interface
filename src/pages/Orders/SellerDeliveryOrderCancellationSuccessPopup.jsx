const SellerDeliveryOrderCancellationSuccessPopup = ({
  showCancelSuccessModal,
  setShowCancelSuccessModal,
}) => {
  return (
    showCancelSuccessModal && (
      <div
        onClick={() => setShowCancelSuccessModal((prev) => !prev)}
        className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x"
      >
        <div className="w-full bg-white max-w-[471px] rounded-[32px] p-7 text-center space-y-3">
          <div className="w-[122px] h-[122px] flex items-center justify-center bg-[var(--button-bg)] rounded-full mx-auto">
            <img
              src="/cancel-order-icon.png"
              alt="cancel-order-icon"
              className="w-[55px] h-[55px]"
            />
          </div>
          <h4 className="text-[24px] font-semibold leading-none text-center">
            Order Cancelled
          </h4>
          <p className="text-[#565656] text-sm leading-[1.2]">
            Your order successfully cancelled.
          </p>
        </div>
      </div>
    )
  );
};

export default SellerDeliveryOrderCancellationSuccessPopup;
