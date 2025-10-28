import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderSuccessPpup = ({ handleCloseSuccessPopup, ShowOrderPlacePopup }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (ShowOrderPlacePopup) {
      const timer = setTimeout(() => {
        handleCloseSuccessPopup();
        navigate(`/orders/details/5t58t494985`);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [ShowOrderPlacePopup, handleCloseSuccessPopup, navigate]);

  return (
    ShowOrderPlacePopup && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center px-5 py-5">
        <div className="w-full max-w-[471px] bg-white p-7 rounded-[24px]">
          <div className="w-full text-center">
            <div className="w-[107px] h-[107px] bg-[var(--button-bg)] flex items-center justify-center rounded-full mx-auto">
              <img
                src="/check-icon-white.png"
                alt="check-icon"
                className="w-[31px] h-[23px] invert brightness-0"
              />
            </div>
            <h1 className="font-semibold text-[24px] leading-none mt-4">
              Order placed
            </h1>
            <p className="text-[#565656] tracking-tight leading-none mb-4 mt-4">
              Order placed successfully
            </p>
          </div>
        </div>
      </div>
    )
  );
};

export default OrderSuccessPpup;
