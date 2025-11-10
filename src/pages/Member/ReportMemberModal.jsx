import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import Loader from "../../components/Common/Loader";
import { enqueueSnackbar } from "notistack";

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
  const [images, setImages] = useState([]);

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = images.length + files.length;

    if (totalFiles > 5) {
      enqueueSnackbar("You can upload a maximum of 5 images.", {
        variant: "error",
      });
      return;
    }

    const validExtensions = ["image/jpeg", "image/jpg", "image/png"];

    const validFiles = files.filter((file) => {
      if (!validExtensions.includes(file.type)) {
        enqueueSnackbar(
          `${file.name} is not a valid file type. Only JPG and PNG are allowed.`,
          {
            variant: "error",
          }
        );
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        enqueueSnackbar(`${file.name} exceeds 10MB limit.`, {
          variant: "error",
        });
        return false;
      }
      return true;
    });

    setImages((prev) => [...prev, ...validFiles]);
  };

  // Remove a selected image
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const formik = useFormik({
    initialValues: {
      reason: "",
    },
    validationSchema: Yup.object({
      reason: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description must be less than 1000 characters"),
    }),
    onSubmit: async (values, { resetForm }) => {
      if (!selectedReason) {
        enqueueSnackbar("Please select a reason before submitting.", {
          variant: "error",
        });
        return;
      }

      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("title", selectedReason);
        formData.append("description", values.reason);
        images.forEach((img) => formData.append("images", img));

        const response = await axios.post(
          `${BASE_URL}/reports/communities/${communityId}/users/${userId}/report`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response?.data?.success) {
          resetForm();
          setImages([]);
          setSelectedReason("");
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
        className="w-full max-w-[471px] bg-white rounded-[16px] lg:rounded-[32px] p-7 lg:p-9 flex flex-col gap-2 shadow-xl"
      >
        <h2 className="text-[22px] font-semibold leading-tight">
          Reason for reporting
        </h2>
        <p className="text-[#202020] text-base">
          To help improve your experience, please let us know why you are
          reporting this user.
        </p>

        {/* Image Upload */}
        <div className="w-full mt-2">
          <label className="text-xs font-medium">
            Upload Images (Optional)
          </label>
          <div className="flex flex-col items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-[94px] border-2 border-gray-400 border-dashed rounded-lg cursor-pointer bg-gray-50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-1 text-sm text-gray-500">
                  <span className="font-normal text-black">
                    Upload supporting images
                  </span>
                </p>
                <p className="text-xs text-gray-500">
                  Max 5 images, up to 10MB each (JPG, PNG, JPEG)
                </p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Preview selected images */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-10 h-10 border border-gray-300 rounded-lg overflow-hidden"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(i)}
                    className="absolute top-1 right-1 bg-black bg-opacity-60 text-white text-xs rounded-full px-1"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Report Reasons */}
        <ul className="w-full flex flex-col gap-2 mt-2">
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

        {/* Description Textarea (shown when any reason is selected) */}
        {selectedReason && (
          <div className="w-full mt-2">
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
        <div className="w-full grid grid-cols-2 gap-3 mt-2">
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
