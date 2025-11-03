import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Loader from "../../components/Common/Loader";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";

const MemberReviews = ({ member }) => {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /** Fetch all reviews of the member */
  const fetchSellerReviews = async () => {
    if (!member?.id) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.get(
        `${BASE_URL}/reviews/users/${member.id}/reviews`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      setReviews(data?.data || {});
    } catch (err) {
      setError("Failed to load reviews. Please try again later.");
      handleApiError(err, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member?.id]);

  /** Loading State */
  if (loading) {
    return (
      <div className="w-full bg-white rounded-[18px] p-5">
        <div className="w-full rounded-[18px] p-5 lg:p-7 bg-[var(--secondary-bg)] min-h-[50vh] flex items-center justify-center">
          <Loader />
        </div>
      </div>
    );
  }

  /** Error State */
  if (error) {
    return (
      <div className="w-full bg-white rounded-[18px] p-5">
        <div className="w-full rounded-[18px] p-5 bg-[var(--secondary-bg)] flex items-center justify-center min-h-[40vh] text-center">
          <p className="text-red-500 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  /** No Reviews Found */
  if (!reviews || reviews?.totalReviews === 0) {
    return (
      <div className="w-full bg-white rounded-[18px] p-5">
        <div className="w-full rounded-[18px] p-5 lg:p-7 bg-[var(--secondary-bg)] flex flex-col items-center justify-center min-h-[40vh]">
          <p className="text-gray-500 text-sm">
            No reviews found for this member.
          </p>
        </div>
      </div>
    );
  }

  /** Main UI */
  return (
    <div className="w-full bg-white rounded-[18px] p-5">
      <div className="w-full rounded-[18px] p-5 lg:p-7 bg-[var(--secondary-bg)]">
        {/* Header */}
        <h2 className="text-[24px] font-semibold leading-none">
          Reviews{" "}
          {reviews?.totalReviews > 0 && (
            <span className="text-gray-600">{`(${reviews?.totalReviews})`}</span>
          )}
        </h2>

        <div className="w-full border mt-5" />

        {/* Reviews List */}
        {reviews?.reviews?.map((review, index) => {
          const rating = review?.rating || 0;
          return (
            <div
              key={index}
              className={`w-full overflow-hidden ${
                reviews?.totalReviews > 1
                  ? "border-b border-gray-300 py-5"
                  : "pt-5"
              }`}
            >
              {/* Rating */}
              <div className="flex items-center gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < rating ? "text-yellow-500" : "text-gray-300"}
                  />
                ))}
              </div>

              {/* Comment */}
              {review?.comment ? (
                <p className="text-sm text-gray-700 mb-3 break-words">
                  {review.comment}
                </p>
              ) : (
                <p className="text-sm text-gray-700 mb-3 break-words">N/A</p>
              )}

              {/* Reviewer Info */}
              <div className="flex items-center gap-2">
                <img
                  src="/profile-icon.png"
                  alt="Reviewer"
                  className="w-[32px] h-[32px] rounded-full object-cover"
                />
                <p className="text-xs font-medium text-gray-800">
                  {review?.reviewer_first_name} {review?.reviewer_last_name}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MemberReviews;
