import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "../../components/Common/Button";
import { useSearchParams } from "react-router-dom";
import { getToken } from "../../utils/getToken";
import { BASE_URL } from "../../data/baseUrl";
import { enqueueSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

export const productReportReasons = [
  { key: "fraudulent", value: "reportProduct.reasons.fraudulent" },
  { key: "misleading", value: "reportProduct.reasons.misleading" },
  { key: "counterfeit", value: "reportProduct.reasons.counterfeit" },
  { key: "inappropriate", value: "reportProduct.reasons.inappropriate" },
  { key: "prohibited", value: "reportProduct.reasons.prohibited" },
  { key: "pricing", value: "reportProduct.reasons.pricing" },
  { key: "others", value: "reportProduct.reasons.others" },
];

const ReportProductModal = ({ setIsReportModalOpen, setIsReportedSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId") || null;
  const { t } = useTranslation("productManagement");

  const initialValues = {
    reason: "",
    description: "",
  };

  const validationSchema = Yup.object({
    reason: Yup.string().required(t("reportProduct.validation.selectReason")),
    description: Yup.string()
      .required(t("reportProduct.validation.descriptionRequired"))
      .min(10, t("reportProduct.validation.descriptionMin"))
      .max(1000, t("reportProduct.validation.descriptionMax")),
  });

  const handleSubmit = async (values) => {
    try {
      setIsSubmitting(true);

      const response = await fetch(`${BASE_URL}/products/reports/`, {
        method: "POST",
        headers: {
          "Accept-Language": i18n.language,
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
        enqueueSnackbar(data?.message || t("reportProduct.alreadyReported"), {
          variant: "error",
        });
        return;
      }

      setIsReportedSuccess(true);
      setIsReportModalOpen(false);
    } catch (error) {
      if (error?.response?.status === 409) {
        enqueueSnackbar(
          error?.response?.data?.message || t("reportProduct.alreadyReported"),
          { variant: "warning" },
        );
        return;
      }

      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          t("reportProduct.somethingWentWrong"),
        { variant: "error" },
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
            {t("reportProduct.title")}
          </h3>
          <button type="button" onClick={() => setIsReportModalOpen(false)}>
            <img src="/close-icon.png" alt="close modal icon" width={19} />
          </button>
        </div>

        <p className="text-[#202020] mt-3">{t("reportProduct.subtitle")}</p>

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
                      value={reason.key}
                      id={reason.key}
                    />
                    <label htmlFor={reason.key} className="text-[#202020]">
                      {t(reason.value)}
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
                  {t("reportProduct.descriptionLabel")}
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
                  title={t("reportProduct.submit")}
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
