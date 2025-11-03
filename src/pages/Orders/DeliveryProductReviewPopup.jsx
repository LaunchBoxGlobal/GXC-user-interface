import { useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";

const DeliveryProductReviewPopup = ({
  openFeedbackModal,
  setOpenFeedbackModal,
  product,
  setShowFeedbackSuccessPopup,
  fetchOrderDetails,
}) => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!rating) {
      enqueueSnackbar("Please select a rating before submitting.", {
        variant: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${BASE_URL}/reviews/order-items/${product?.id}/review`,
        {
          rating,
          comment: comment.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response?.data?.success) {
        setShowFeedbackSuccessPopup(true);
        setOpenFeedbackModal(false);
      }
    } catch (error) {
      // console.error("Error submitting review >>>", error);
      handleApiError(error, navigate);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!openFeedbackModal) return null;

  return (
    <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x">
      <form
        onSubmit={handleSubmitReview}
        className="w-full bg-white max-w-[471px] rounded-[32px] p-7 text-start relative"
      >
        {/* Header */}
        <h4 className="text-[24px] font-semibold leading-none">Write Review</h4>

        {/* Product Info */}
        {product && (
          <div className="w-full flex items-center gap-3 my-5">
            <img
              src={product?.productImage}
              alt={product?.productTitle}
              className="w-[72px] h-[72px] object-cover rounded-[16px]"
            />
            <div className="flex flex-col items-start justify-center">
              <p className="text-lg font-semibold leading-none">
                {product?.productTitle?.length > 30
                  ? `${product?.productTitle.slice(0, 20)}...`
                  : product?.productTitle}
              </p>
              <p className="text-sm text-[#18181899] capitalize">
                {product?.deliveryMethod === "delivery"
                  ? "Delivery"
                  : product?.deliveryMethod === "pickup"
                  ? "Pickup"
                  : "Pickup / Delivery"}
              </p>
            </div>
          </div>
        )}

        {/* Rating */}
        <div className="flex flex-col items-start justify-center">
          <p className="text-sm font-medium leading-none mb-2">Your Rating</p>
          <div className="w-full flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`text-2xl cursor-pointer transition-all ${
                  star <= (hover || rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(null)}
              />
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="w-full mt-5">
          <textarea
            name="review"
            id="review"
            placeholder="Share your experience with this product..."
            className="w-full h-[174px] resize-none bg-[var(--secondary-bg)] rounded-[12px] p-4 placeholder:text-[#959393] outline-none"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="w-full flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setOpenFeedbackModal(false);
              fetchOrderDetails();
            }}
            className="w-1/2 h-[48px] rounded-[12px] border border-gray-300 font-medium text-gray-700 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-1/2 h-[48px] rounded-[12px] text-center font-medium text-white transition-all ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[var(--button-bg)] hover:opacity-90"
            }`}
          >
            {isSubmitting ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryProductReviewPopup;
