const CancelOrderSuccessPopup = ({
  showCancellationSuccessPopup,
  setShowCancellationSuccessPopup,
}) => {
  const handleClosePopup = () => {
    setShowCancellationSuccessPopup(false);
  };
  return (
    showCancellationSuccessPopup && (
      <div
        onClick={() => handleClosePopup()}
        className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x"
      >
        <div className="w-full bg-white max-w-[471px] rounded-[32px] p-7 text-center">
          <div className="w-[122px] h-[122px] flex items-center justify-center bg-[var(--button-bg)] rounded-full mx-auto">
            <img
              src="/order-cancelled-popup-icon.png"
              alt="order-cancelled-popup-icon"
              className="w-[55px] h-[55px]"
            />
          </div>
          <h4 className="text-[24px] font-semibold leading-none text-center mt-4">
            Order Cancelled
          </h4>
          <p className="text-[#565656] text-sm leading-[1.2] mt-3">
            Your order successfully cancelled
          </p>
        </div>
      </div>
    )
  );
};

export default CancelOrderSuccessPopup;
