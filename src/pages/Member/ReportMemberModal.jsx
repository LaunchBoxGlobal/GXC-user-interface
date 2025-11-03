import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import Loader from "../../components/Common/Loader";

export const reportReasons = [
  "Fraudulent Listings",
  "Misleading Information",
  "Counterfeit Products",
  "Non-Delivery",
  "Poor Quality Products",
  "Seller Misconducts",
  "Others",
];

const ReportMemberModal = ({
  openReportMemberModal,
  setOpenReportMemberModal,
  setOpenReportMemberSuccessModal,
}) => {
  const { communityId, userId } = useParams();
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState("");
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      reason: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string()
        .min(10, "Reason must be at least 10 characters")
        .max(1000, "Reason must be less than 1000 characters")
        .when([], {
          is: () => selectedReason === "Others",
          then: (schema) => schema.required("Please enter your reason"),
        }),
    }),
    onSubmit: async (values, { resetForm }) => {
      const finalReason =
        selectedReason === "Others" ? values.reason : selectedReason;

      if (!finalReason) {
        alert("Please select or enter a reason before submitting.");
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(
          `${BASE_URL}/reports/communities/${communityId}/users/${userId}/report`,
          { reason: finalReason },
          { headers: { Authorization: `Bearer ${getToken()}` } }
        );

        if (response?.data?.success) {
          resetForm();
          setOpenReportMemberModal(false);
          setOpenReportMemberSuccessModal(true);
        }
      } catch (error) {
        console.error("Report error:", error);
        handleApiError(error, navigate);
      } finally {
        setLoading(false);
      }
    },
  });

  if (!openReportMemberModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] padding-x">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-[471px] bg-white rounded-[16px] lg:rounded-[32px] p-7 lg:p-9 flex flex-col gap-5 shadow-xl"
      >
        <h2 className="text-[22px] font-semibold leading-tight">
          Why do you want to report?
        </h2>
        <p className="text-[#202020] text-base">
          To help improve your experience, please let us know why you are
          reporting this user.
        </p>

        {/* Report Reasons */}
        <ul className="w-full flex flex-col gap-2">
          {reportReasons.map((reason, index) => (
            <li key={index} className="flex items-center gap-2">
              <input
                type="radio"
                name="reportReason"
                id={`reason-${index}`}
                value={reason}
                checked={selectedReason === reason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="cursor-pointer accent-[var(--button-bg)]"
              />
              <label
                htmlFor={`reason-${index}`}
                className="cursor-pointer text-base text-[#202020]"
              >
                {reason}
              </label>
            </li>
          ))}
        </ul>

        {/* Custom Reason Textarea */}
        {selectedReason === "Others" && (
          <div className="w-full mt-3">
            <textarea
              placeholder="Please describe your reason..."
              className="w-full border border-gray-300 rounded-[10px] p-3 text-sm resize-none outline-none"
              rows="3"
              id="reason"
              name="reason"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.reason}
            />
            {formik.touched.reason && formik.errors.reason && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.reason}
              </p>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="w-full grid grid-cols-2 gap-3 mt-5">
          <button
            type="button"
            onClick={() => setOpenReportMemberModal(false)}
            className="w-full h-[48px] rounded-[12px] bg-[#EDEDED] text-gray-700 font-medium hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-[48px] rounded-[12px] text-white font-medium transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[var(--button-bg)] hover:opacity-90"
            }`}
          >
            {loading ? <Loader /> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReportMemberModal;
