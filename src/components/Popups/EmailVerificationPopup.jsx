import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { useTranslation } from "react-i18next";

const EmailVerificationPopup = ({ togglePopup }) => {
  const { setShowEmailVerificationPopup, showEmailVerificationPopup } =
    useAppContext();
  const { t } = useTranslation("auth");

  useEffect(() => {
    document.title = `Account verified - GiveXChange`;
  }, []);

  const handleContinue = () => {
    setShowEmailVerificationPopup(false);
  };

  return (
    showEmailVerificationPopup && (
      <div className="w-full h-screen fixed inset-0 px-5 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center">
        <div className="w-full max-w-[471px] bg-white p-8 rounded-2xl">
          <div className="w-full text-center">
            <div className="w-[107px] h-[107px] bg-[var(--button-bg)] flex items-center justify-center rounded-full mx-auto">
              <img
                src="/check-icon-white.png"
                alt="check-icon"
                className="w-[31px] h-[23px] invert brightness-0"
              />
            </div>
            <h1 className="font-semibold text-[32px] leading-[1] mt-7 mb-6">
              {t(`auth.email_verified`)}
            </h1>
            <button
              type="button"
              onClick={() => togglePopup()}
              className="w-full bg-[var(--button-bg)] text-white rounded-[8px] font-medium text-center h-[49px] block py-[14px]"
            >
              {t(`button.continue`)}
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EmailVerificationPopup;
