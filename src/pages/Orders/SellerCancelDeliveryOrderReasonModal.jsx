import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { useNavigate, useSearchParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { useFormik } from "formik";
import * as Yup from "yup";

const SellerCancelDeliveryOrderReasonModal = ({
  showCancelReasonModal,
  setShowCancelReasonModal,
  setShowCancelSuccessModal,
  fetchOrderDetails,
}) => {
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("itemId");
  const navigate = useNavigate();

  // ✅ Yup validation schema
  const validationSchema = Yup.object().shape({
    cancellationReason: Yup.string()
      .trim()
      .min(10, "Reason must be at least 10 characters")
      .max(500, "Reason must not exceed 500 characters")
      .nullable(), // optional
  });

  // ✅ Formik setup
  const formik = useFormik({
    initialValues: {
      cancellationReason: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      if (!itemId) {
        enqueueSnackbar(
          "Something went wrong. Reload the page and try again.",
          {
            variant: "error",
          }
        );
        return;
      }

      try {
        const response = await axios.put(
          `${BASE_URL}/order-items/${itemId}/cancel`,
          {
            reason: values.cancellationReason?.trim() || "",
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (response?.data?.success) {
          fetchOrderDetails();
          setShowCancelSuccessModal(true);
          setShowCancelReasonModal(false);
        }
      } catch (error) {
        handleApiError(error, navigate);
      }
    },
  });

  return (
    showCancelReasonModal && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] flex items-center justify-center padding-x">
        <div className="w-full bg-white max-w-[471px] rounded-[32px] p-7 text-start flex flex-col items-start gap-3">
          <h4 className="text-[24px] font-semibold leading-none">
            Cancel Reason
          </h4>

          <form onSubmit={formik.handleSubmit} className="w-full">
            <div className="w-full">
              <textarea
                name="cancellationReason"
                id="cancellationReason"
                className={`w-full border ${
                  formik.touched.cancellationReason &&
                  formik.errors.cancellationReason
                    ? "border-red-500"
                    : "border-[#C6C6C6]"
                } outline-none rounded-[12px] h-[129px] resize-none p-3 text-sm`}
                value={formik.values.cancellationReason}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Enter reason (optional)"
              ></textarea>
              {formik.touched.cancellationReason &&
                formik.errors.cancellationReason && (
                  <p className="text-xs text-red-500 mt-1">
                    {formik.errors.cancellationReason}
                  </p>
                )}
            </div>

            <div className="w-full pt-2">
              <button
                type="submit"
                className="bg-[var(--button-bg)] font-medium w-full h-[48px] rounded-[12px] text-center text-white"
              >
                OK
              </button>

              <button
                type="submit"
                // onClick={() => setShowCancelReasonModal(false)}
                className="underline font-medium text-sm text-center w-full mt-3"
              >
                Not Now
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default SellerCancelDeliveryOrderReasonModal;
