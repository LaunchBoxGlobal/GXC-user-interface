import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../components/Common/Button";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getToken } from "../../utils/getToken";
import { BASE_URL } from "../../data/baseUrl";
import { handleApiError } from "../../utils/handleApiError";
import { enqueueSnackbar } from "notistack";

export const productReportReasons = [
  "Fraudulent Listing",
  "Misleading Description",
  "Counterfeit Product",
  "Inappropriate Content",
  "Prohibited Item",
  "Pricing Violation",
  "Others",
];

const ReportProductModal = ({ setIsReportModalOpen, setIsReportedSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  //   const { productId } = useParams();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId") || null;
  const navigate = useNavigate();

  const initialValues = {
    reason: "",
    description: "",
  };

  const validationSchema = Yup.object({
    reason: Yup.string().required("Please select a reason"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description can not be less than 10 characters.")
      .max(1000, "Description can not be less than 1000 characters."),
  });

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`${BASE_URL}/products/reports/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          product_id: productId,
          title: values.reason,
          description: values.description,
        }),
      });

      const data = await response.json();

      if (response.status === 409) {
        enqueueSnackbar(
          data?.message || "You have already reported this product.",
          { variant: "error" }
        );
        return;
      }

      // if (!response.ok) {
      //   throw new Error(data?.message || "Failed to submit report");
      // }

      setIsReportedSuccess(true);
      setIsReportModalOpen(false);
    } catch (error) {
      if (error?.response?.status === 409) {
        enqueueSnackbar(
          error?.response?.data?.message ||
            "You have already reported this product.",
          { variant: "warning" }
        );
        return;
      }
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong.",
        { variant: "error" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center px-4 z-50">
      <div className="w-full max-w-[500px] bg-white p-5 rounded-xl">
        <div className="w-full flex items-center justify-between gap-5">
          <h3 className="text-[24px] font-semibold">
            Why do you want to report?
          </h3>
          <button type="button" onClick={() => setIsReportModalOpen(false)}>
            <img src="/close-icon.png" alt="close modal icon" width={19} />
          </button>
        </div>

        <p className="text-[#202020] mt-3">
          To help improve your experience, please tell us why you are reporting
          this product.
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="mt-4 w-full">
              <ul className="w-full space-y-1">
                {productReportReasons.map((reason, index) => (
                  <li key={index} className="w-full flex items-center gap-2">
                    <Field
                      type="radio"
                      name="reason"
                      value={reason}
                      id={reason}
                    />
                    <label htmlFor={reason} className="text-[#202020]">
                      {reason}
                    </label>
                  </li>
                ))}
              </ul>

              <ErrorMessage
                name="reason"
                component="p"
                className="text-red-500 text-sm mt-1"
              />

              <div className="w-full mt-4 space-y-1">
                <label
                  htmlFor="description"
                  className="font-medium text-[#202020] text-sm"
                >
                  Description
                </label>
                <Field
                  as="textarea"
                  name="description"
                  id="description"
                  className="w-full bg-[var(--light-bg)] h-[117px] resize-none p-4 rounded-lg outline-none"
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="w-full mt-4">
                <Button
                  type="submit"
                  title="Submit"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ReportProductModal;
