import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { HiArrowLeft } from "react-icons/hi";
import Button from "../../components/Common/Button";
import { useFormik } from "formik";
import * as Yup from "yup";
import ReportSuccessPopup from "./ReportSuccessPopup";

const ReportingPage = () => {
  const navigate = useNavigate();
  const [isReportSubmitted, setIsReportSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      description: "",
    },
    validationSchema: Yup.object({
      description: Yup.string()
        .min(10, "Description must be 10 characters or more")
        .max(1500, "Must be 1500 characters or less")
        .required("Description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}/reports/bugs`, values, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (response.data.success) {
          setIsReportSubmitted(true);
          resetForm();
        }
      } catch (error) {
        console.error(error);
        handleApiError(error, navigate);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full bg-transparent rounded-[10px] padding-x pt-20 min-h-screen"
      >
        <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4">
          <div className="w-full">
            <textarea
              name="report"
              id="report"
              placeholder="Enter description..."
              className="w-full bg-white rounded-[18px] relative p-5 min-h-[45vh] text-lg resize-none outline-none"
            ></textarea>
          </div>
        </div>

        <div className="w-full flex justify-end mt-10">
          <div className="w-full max-w-[190px]">
            <Button
              title={"Submit Request"}
              type={"submit"}
              isLoading={loading}
            />
          </div>
        </div>
      </form>

      <ReportSuccessPopup
        isReportSubmitted={isReportSubmitted}
        setIsReportSubmitted={setIsReportSubmitted}
      />
    </>
  );
};

export default ReportingPage;
