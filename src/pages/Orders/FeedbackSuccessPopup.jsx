import { useTranslation } from "react-i18next";

const FeedbackSuccessPopup = ({
  showFeedbackSuccessPopup,
  setShowFeedbackSuccessPopup,
  fetchOrderDetails,
}) => {
  const { t } = useTranslation("orderManagement");

  return (
    showFeedbackSuccessPopup && (
      <div
        onClick={() => {
          setShowFeedbackSuccessPopup(false);
          fetchOrderDetails();
        }}
        className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x"
      >
        <div className="w-full bg-white max-w-[471px] rounded-[32px] p-7 lg:py-10 text-center space-y-3">
          <div className="w-[122px] h-[122px] flex items-center justify-center bg-[var(--button-bg)] rounded-full mx-auto">
            <img
              src="/feedback-success-popup-icon.png"
              alt={t("feedbackSuccessPopup.iconAlt")}
              className="w-[54px] h-[50px]"
            />
          </div>

          <h4 className="text-[24px] font-semibold leading-none text-center">
            {t("feedbackSuccessPopup.title")}
          </h4>

          <p className="text-[#565656] text-sm leading-[1.2]">
            {t("feedbackSuccessPopup.description")}
          </p>
        </div>
      </div>
    )
  );
};

export default FeedbackSuccessPopup;
