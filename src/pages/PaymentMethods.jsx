import Button from "../components/Common/Button";
import { Link } from "react-router-dom";
import AddNewPaymentMethodPopup from "../components/Popups/AddNewPaymentMethodPopup";
import { useAppContext } from "../context/AppContext";
import PaymentInfoSuccessPopup from "../components/Popups/PaymentInfoSuccessPopup";

const PaymentMethods = () => {
  const { handleShowPaymentModal, showSuccessModal, handleCloseSuccessModal } =
    useAppContext();

  return (
    <>
      <AddNewPaymentMethodPopup />

      <div className="w-full max-w-[350px]">
        <div className="w-full">
          <img
            src="/image-placeholder.png"
            alt=""
            className="w-[107px] h-[107px] rounded-full object-contain mx-auto"
          />
        </div>
        <div className="w-full text-center space-y-3 mt-7">
          <h1 className="font-semibold text-[32px] leading-none">
            Payment Method
          </h1>
          <p className="text-[var(--secondary-color)]">
            Please enter card details to continue
          </p>
        </div>

        <div className="w-full mt-10 border-2 border-black p-4 rounded-md flex items-center justify-between gap-4">
          <div className="">
            <p className="font-semibold">John Doe</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-[22px] h-[22px] bg-gray-400 flex items-center justify-center rounded-md">
                <span className="text-white font-semibold">S</span>
              </div>
              <p className="">0112**********12</p>
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <button type="button">
              <img
                src="/edit-icon.png"
                alt="edit-icon"
                className="w-[16px] h-[17px]"
              />
            </button>
            <button type="button">
              <img
                src="/trash-icon.png"
                alt="trash-icon"
                className="w-[17px] h-[19px]"
              />
            </button>

            <img
              src="/black-check-icon.png"
              alt="black check icon"
              className="w-[25px] h-[25px]"
            />
          </div>
        </div>

        <div className="w-full flex justify-end mt-2">
          <button
            type="button"
            onClick={handleShowPaymentModal}
            className="font-medium text-xs underline"
          >
            Add New Account
          </button>
        </div>

        <div className="w-full mt-8">
          <Link
            to={`/account-created`}
            className="font-medium w-full bg-[var(--button-bg)] text-white h-[49px] block text-center py-[14px] rounded-[8px]"
          >
            Next
          </Link>
        </div>

        <div className="text-center mt-5">
          <Link to={`/`} className="font-medium">
            Skip
          </Link>
        </div>
      </div>

      <PaymentInfoSuccessPopup
        showPopup={showSuccessModal}
        handleTogglePopup={handleCloseSuccessModal}
      />
    </>
  );
};

export default PaymentMethods;
