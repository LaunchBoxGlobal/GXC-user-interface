import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import Button from "../../components/Common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import MarkItemMissingImageUpload from "./MarkItemMissingImageUpload";
import { useAppContext } from "../../context/AppContext";
import { enqueueSnackbar } from "notistack";

const MarkItemMissingModal = ({
  setOpenMissingItemReportModal,
  missingItem,
  fetchOrderDetails,
}) => {
  const navigate = useNavigate();
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { fetchNotificaiontCount } = useAppContext();

  useEffect(() => {
    document.title = "Reporting - giveXchange";
    fetchNotificaiontCount();
  }, []);

  const formik = useFormik({
    initialValues: {
      description: "",
      images: [],
    },

    validationSchema: Yup.object({
      description: Yup.string()
        .min(10, "Description must be 10 characters or more")
        .max(1500, "Description must be 1500 characters or less")
        .required("Description is required"),
    }),

    onSubmit: async (values, { resetForm }) => {
      console.log("missingItem >> ", missingItem);
      if (!missingItem) {
        return;
      }
      // return;
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("description", values.description);
        formData.append("orderItemId", missingItem?.id);

        // Append images only if available
        values.images.forEach((img) => {
          formData.append("images", img);
        });
        // formData,

        const response = await axios.post(
          `${BASE_URL}/reports/order-report`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
              // "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success) {
          enqueueSnackbar(
            response?.data?.message || "Order report submitted successfully.",
            { variant: "success" }
          );
          resetForm();
          setOpenMissingItemReportModal(false);
          fetchOrderDetails();
        }
      } catch (error) {
        handleApiError(error, navigate);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="w-full min-h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center px-5 py-10">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full lg:max-w-[40%] bg-white rounded-[10px] p-7"
      >
        <div className="w-full flex items-center justify-between gap-4">
          <h3 className="text-[20px] font-semibold leading-none">
            Mark Item Missing
          </h3>

          <button
            type="button"
            onClick={() => setOpenMissingItemReportModal(false)}
          >
            <img src="/close-icon.png" alt="close modal icon" width={18} />
          </button>
        </div>
        <div className="w-full border my-5" />
        <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4">
          <div className="w-full flex flex-col gap-4">
            <div className="w-full mt-4">
              <textarea
                name="description"
                placeholder="Enter description..."
                className="w-full bg-white rounded-[18px] relative p-5 min-h-[185px] text-base resize-none outline-none"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.description}
                </p>
              )}
            </div>

            <MarkItemMissingImageUpload
              images={formik.values.images}
              setImages={(imgs) => formik.setFieldValue("images", imgs)}
            />
          </div>
        </div>

        <div className="w-full flex justify-end mt-5">
          <div className="w-full max-w-[130px]">
            <Button title={"Submit"} type={"submit"} isLoading={loading} />
          </div>
        </div>
      </form>
    </div>
  );
};

export default MarkItemMissingModal;
