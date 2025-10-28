const FeedbackSuccessPopup = ({
  showFeedbackSuccessPopup,
  setShowFeedbackSuccessPopup,
}) => {
  return (
    showFeedbackSuccessPopup && (
      <div
        onClick={() => setShowFeedbackSuccessPopup(false)}
        className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x"
      >
        <div className="w-full bg-white max-w-[471px] rounded-[32px] p-7 lg:py-10 text-center space-y-3">
          <div className="w-[122px] h-[122px] flex items-center justify-center bg-[var(--button-bg)] rounded-full mx-auto">
            <img
              src="/feedback-success-popup-icon.png"
              alt="product-delivery-popup-icon"
              className="w-[54px] h-[50px]"
            />
          </div>
          <h4 className="text-[24px] font-semibold leading-none text-center">
            Thanks for your valuable feeback
          </h4>
          <p className="text-[#565656] text-sm leading-[1.2]">
            Thank you for your valuable feedback. We appreciate your input and
            will use it to enhance our products and services.
          </p>
        </div>
      </div>
    )
  );
};

export default FeedbackSuccessPopup;
