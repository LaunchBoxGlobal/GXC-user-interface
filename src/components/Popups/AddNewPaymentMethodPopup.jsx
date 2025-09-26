import { useAppContext } from "../../context/AppContext";

const AddNewPaymentMethodPopup = () => {
  const {
    showPaymentModal,
    handleShowPaymentModal,
    handleShowSuccessModal,
    handleCloseSuccessModal,
  } = useAppContext();

  const addPaymentMethod = () => {
    handleShowPaymentModal();
    handleShowSuccessModal();
  };

  return (
    showPaymentModal && (
      <main className="w-full h-screen fixed inset-0 z-50 flex items-center justify-center px-4 bg-[rgba(0,0,0,0.4)]">
        <div className="w-full max-w-[872px] min-h-[357px] bg-white flex flex-col items-start gap-4 rounded-[18px] p-7 lg:p-10">
          <h2 className="text-[32px] font-semibold leading-none">
            Add New Card
          </h2>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            <div className="">
              <label
                htmlFor="cardHolderName"
                className="font-medium leading-none"
              >
                Card Holder Name
              </label>
              <input
                type="text"
                className={`w-full border h-[49px] px-[15px] py-[14px] rounded-[8px] outline-none border-[#D9D9D9]`}
              />
            </div>
            <div className="">
              <label
                htmlFor="cardHolderName"
                className="font-medium leading-none"
              >
                Date of Birth
              </label>
              <input
                type="date"
                className={`w-full border h-[49px] px-[15px] py-[14px] rounded-[8px] outline-none border-[#D9D9D9]`}
              />
            </div>
            <div className="">
              <label
                htmlFor="cardHolderName"
                className="font-medium leading-none"
              >
                Card Number
              </label>
              <input
                type="text"
                className={`w-full border h-[49px] px-[15px] py-[14px] rounded-[8px] outline-none border-[#D9D9D9]`}
              />
            </div>
            <div className="">
              <label
                htmlFor="cardHolderName"
                className="font-medium leading-none"
              >
                CVC
              </label>
              <input
                type="text"
                className={`w-full border h-[49px] px-[15px] py-[14px] rounded-[8px] outline-none border-[#D9D9D9]`}
              />
            </div>
          </div>

          <div className="flex items-center gap-1 my-3">
            <input
              type="checkbox"
              name="savePaymentMethod"
              id="savePaymentMethod"
              className="w-[18px] h-[18px]"
            />
            <label htmlFor="savePaymentMethod" className="text-sm font-medium">
              Save my payment details for future purchase.
            </label>
          </div>

          <div className="w-full grid grid-cols-2 gap-5">
            <button
              type="button"
              onClick={() => handleCloseSuccessModal()}
              className="w-full h-[49px] text-center rounded-[8px] bg-[#7373731C] text-lg font-medium text-[var(--secondary-color)]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={addPaymentMethod}
              className="w-full h-[49px] text-center rounded-[8px] bg-[var(--button-bg)] text-lg font-medium text-white"
            >
              Add
            </button>
          </div>
        </div>
      </main>
    )
  );
};

export default AddNewPaymentMethodPopup;
