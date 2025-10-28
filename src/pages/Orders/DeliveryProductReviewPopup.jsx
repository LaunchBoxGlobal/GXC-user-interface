import { FaStar } from "react-icons/fa";

const DeliveryProductReviewPopup = ({
  openFeedbackModal,
  setOpenFeedbackModal,
  product,
  setShowFeedbackSuccessPopup,
}) => {
  const handleSubmitReview = () => {
    setShowFeedbackSuccessPopup(true);
    setOpenFeedbackModal(false);
  };
  return (
    openFeedbackModal && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x">
        <div className="w-full bg-white max-w-[471px] rounded-[32px] p-7 text-start">
          <h4 className="text-[24px] font-semibold leading-none">
            Write Review
          </h4>
          <div className="w-full flex items-center gap-3 my-5">
            <img
              src="/denim-jacket-image.png"
              alt=""
              className="w-[72px] h-[72px] object-cover rounded-[16px]"
            />
            <div className="flex flex-col items-start justify-center">
              <p className="text-lg font-semibold leading-none">Product Name</p>
              <p className="text-sm text-[#18181899]">Pickup/Delivery</p>
            </div>
          </div>
          <div className="flex flex-col items-start justify-center">
            <p className="text-sm font-medium leading-none">Your Rating</p>
            <div className="w-full flex items-center gap-1 mt-2">
              <FaStar className="text-xl text-yellow-500" />
              <FaStar className="text-xl text-yellow-500" />
              <FaStar className="text-xl text-yellow-500" />
              <FaStar className="text-xl text-yellow-500" />
              <FaStar className="text-xl text-yellow-500" />
            </div>

            <div className="w-full mt-4">
              <textarea
                name="review"
                id="review"
                placeholder="Description"
                className="w-full h-[174px] resize-none bg-[var(--secondary-bg)] rounded-[12px] p-4 placeholder:text-[#959393] outline-none"
              ></textarea>
            </div>
          </div>

          <div className="w-full pt-2">
            <button
              type="button"
              onClick={() => handleSubmitReview()}
              className="bg-[var(--button-bg)] font-medium w-full h-[48px] rounded-[12px] text-center text-white"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default DeliveryProductReviewPopup;
