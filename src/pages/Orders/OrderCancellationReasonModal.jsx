import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { enqueueSnackbar } from "notistack";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";

const OrderCancellationReasonModal = ({
  showCancellationReasonPopup,
  setShowCancellationReasonPopup,
  setShowCancellationSuccessPopup,
  product,
  fetchOrderDetails,
}) => {
  const [loading, setLoading] = useState(false);

  // ✅ Validation schema
  const validationSchema = Yup.object({
    reason: Yup.string()
      .trim()
      .required("Cancellation reason is required.")
      .min(10, "Reason must be at least 10 characters.")
      .max(200, "Reason must not exceed 200 characters."),
  });

  const formik = useFormik({
    initialValues: { reason: "" },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!product?.id) {
        enqueueSnackbar("Invalid product information.", { variant: "error" });
        return;
      }

      try {
        setLoading(true);
        const payload = { reason: values.reason.trim() };

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
          resetForm();
          setShowCancellationReasonPopup(false);
          setShowCancellationSuccessPopup(true);
          fetchOrderDetails?.();
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
    },
  });

  if (!showCancellationReasonPopup) return null;

  return (
    <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4">
      <div className="w-full bg-white p-7 rounded-[16px] max-w-[471px] relative">
        <h3 className="text-[24px] font-semibold leading-none">
          Cancel reason
        </h3>

        <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
          <div>
            <textarea
              name="reason"
              id="reason"
              placeholder="Write your reason for cancellation"
              value={formik.values.reason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full h-[129px] resize-none border rounded-[12px] outline-none px-3 py-3 text-gray-700 ${
                formik.touched.reason && formik.errors.reason
                  ? "border-red-500"
                  : "border-[#C6C6C6]"
              }`}
            />
            {formik.touched.reason && formik.errors.reason && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.reason}
              </p>
            )}
          </div>

          <div className="w-full grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => setShowCancellationReasonPopup(false)}
              className="w-full bg-[#EBEBEB] h-[48px] rounded-[12px] text-center font-medium hover:bg-[#dcdcdc] transition-all disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[var(--button-bg)] text-white h-[48px] rounded-[12px] text-center font-medium hover:opacity-90 transition-all disabled:opacity-70"
            >
              {loading ? "Cancelling..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderCancellationReasonModal;
