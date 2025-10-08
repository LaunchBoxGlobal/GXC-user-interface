import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";

const EmailVerificationPopup = ({ togglePopup }) => {
  const { setShowEmailVerificationPopup, showEmailVerificationPopup } =
    useAppContext();

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
                className="w-[31px] h-[23px]"
              />
            </div>
            <h1 className="font-semibold text-[32px] leading-[1.3] mt-7 mb-6">
              Email Address <br /> Verified Successfully
            </h1>
            <button
              type="button"
              onClick={() => togglePopup()}
              className="w-full bg-[var(--button-bg)] text-white rounded-[8px] font-medium text-center h-[49px] block py-[14px]"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EmailVerificationPopup;
