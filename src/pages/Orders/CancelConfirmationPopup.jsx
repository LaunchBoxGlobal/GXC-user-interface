import { useTranslation } from "react-i18next";

const CancelConfirmationPopup = ({
  showOrderCancelPopup,
  setShowOrderCancelPopup,
  setShowCancellationReasonPopup,
}) => {
  const { t } = useTranslation("orderManagement");

  const handleClosePopup = () => {
    setShowOrderCancelPopup(false);
    setShowCancellationReasonPopup(true);
  };

  return (
    showOrderCancelPopup && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x">
        <div className="w-full bg-white max-w-[471px] rounded-[32px] p-7 text-center space-y-3">
          <div className="w-[122px] h-[122px] flex items-center justify-center bg-[var(--button-bg)] rounded-full mx-auto">
            <img
              src="/cancel-order-popup-icon.png"
              alt="cancel-order-popup-icon"
              className="w-[55px] h-[55px]"
            />
          </div>

          <h4 className="text-[24px] font-semibold leading-none text-center">
            {t("cancelPopup.title")}
          </h4>

          <p className="text-[#565656] text-sm leading-[1.2]">
            {t("cancelPopup.description")}
          </p>

          <div className="w-full grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowOrderCancelPopup(false)}
              className="bg-[#EBEBEB] font-medium w-full h-[48px] rounded-[12px] text-center text-black"
            >
              {t("cancelPopup.buttons.no")}
            </button>

            <button
              type="button"
              onClick={() => handleClosePopup(false)}
              className="bg-[var(--button-bg)] font-medium w-full h-[48px] rounded-[12px] text-center text-white"
            >
              {t("cancelPopup.buttons.yes")}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CancelConfirmationPopup;
