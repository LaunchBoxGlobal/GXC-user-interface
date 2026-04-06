import { useTranslation } from "react-i18next";

const DeliveryConfirmationPopup = ({
  showDeliveryConfirmationPopup,
  setShowDeliveryConfirmationPopup,
  setOpenFeedbackModal,
  type,
  fetchOrderDetails,
}) => {
  const { t } = useTranslation("orderManagement");

  const key = type === "delivery" ? "delivered" : "pickedUp";

  return (
    showDeliveryConfirmationPopup && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x">
        <div className="w-full bg-white max-w-[471px] rounded-[32px] p-7 text-center space-y-3">
          <div className="w-[122px] h-[122px] flex items-center justify-center bg-[var(--button-bg)] rounded-full mx-auto">
            <img
              src="/product-delivery-popup-icon.png"
              alt="product-delivery-popup-icon"
              className="w-[63px] h-[48px]"
            />
          </div>

          <h4 className="text-[24px] font-semibold leading-none text-center">
            {t(`deliveryPopup.title.${key}`)}
          </h4>

          <p className="text-[#565656] text-sm leading-[1.2]">
            {t(`deliveryPopup.description.${key}`)}
          </p>

          <div className="w-full grid grid-cols-2 gap-2 pt-2">
            <button
              type="button"
              onClick={async () => {
                await fetchOrderDetails();
                setShowDeliveryConfirmationPopup(false);
              }}
              className="bg-[#EBEBEB] font-medium w-full h-[48px] rounded-[12px] text-center text-black"
            >
              {t("deliveryPopup.buttons.notNow")}
            </button>

            <button
              type="button"
              onClick={() => {
                setOpenFeedbackModal(true);
                setShowDeliveryConfirmationPopup(false);
              }}
              className="bg-[var(--button-bg)] font-medium w-full h-[48px] rounded-[12px] text-center text-white"
            >
              {t("deliveryPopup.buttons.writeReview")}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default DeliveryConfirmationPopup;
