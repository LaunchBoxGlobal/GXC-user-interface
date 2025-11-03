import React, { useState } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
// import { BASE_URL } from "../../data/baseUrl";

const OrderCancellationReasonModal = ({
  showCancellationReasonPopup,
  setShowCancellationReasonPopup,
  setShowCancellationSuccessPopup,
  product,
  fetchOrderDetails,
}) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCancelOrder = async (providedReason) => {
    if (!product?.id) {
      enqueueSnackbar("Invalid product information.", { variant: "error" });
      return;
    }

    try {
      setLoading(true);
      const payload = {
        // productId: product.id,
        reason: providedReason || "",
      };

      const response = await axios.put(
        `${BASE_URL}/order-items/${product?.id}/cancel`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (response?.data?.success) {
        enqueueSnackbar("Order has been cancelled successfully.", {
          variant: "success",
        });
        setShowCancellationReasonPopup(false);
        setShowCancellationSuccessPopup(true);
        // fetchOrderDetails && fetchOrderDetails();
      } else {
        enqueueSnackbar(
          response?.data?.message || "Failed to cancel the order.",
          { variant: "error" }
        );
      }
    } catch (error) {
      console.error("Cancel order error:", error);
      enqueueSnackbar("Something went wrong while cancelling the order.", {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReason = () => handleCancelOrder(reason);
  const handleCancelWithoutReason = () => handleCancelOrder("");

  if (!showCancellationReasonPopup) return null;

  return (
    <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4">
      <div className="w-full bg-white p-7 rounded-[16px] max-w-[471px] relative">
        <h3 className="text-[24px] font-semibold leading-none">
          Cancel Reason
        </h3>

        <div className="w-full my-4">
          <textarea
            name="cancellationReason"
            id="cancellationReason"
            placeholder="Write a reason (optional)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full h-[129px] resize-none border border-[#C6C6C6] rounded-[12px] outline-none px-3 py-3 text-gray-700"
          />
        </div>

        <div className="w-full grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={loading}
            onClick={handleCancelWithoutReason}
            className="w-full bg-[#EBEBEB] h-[48px] rounded-[12px] text-center font-medium hover:bg-[#dcdcdc] transition-all disabled:opacity-70"
          >
            {loading ? "Cancelling..." : "Not Now"}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleSubmitReason}
            className="w-full bg-[var(--button-bg)] text-white h-[48px] rounded-[12px] text-center font-medium hover:opacity-90 transition-all disabled:opacity-70"
          >
            {loading ? "Cancelling..." : "Submit"}
          </button>
        </div>

        {/* {loading && <Loader />} */}
      </div>
    </div>
  );
};

export default OrderCancellationReasonModal;
