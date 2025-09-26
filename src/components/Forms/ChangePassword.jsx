import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import PasswordField from "../Common/PasswordField";
import { useNavigate } from "react-router-dom";
import PasswordUpdateSuccessModal from "../Popups/PasswordUpdateSuccessModal";
import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { useLocation } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  const { email, otp } = location?.state || {};

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords do not match")
        .required("Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const res = await axios.post(`${BASE_URL}/auth/reset-password`, {
          email,
          code: otp,
          password: values?.password,
        });

        console.log("reset password response >>> ", res?.data);

        if (res?.data?.success) {
          alert(res?.data?.message);
          resetForm();
          setShowPopup(true);
        }
      } catch (error) {
        console.log(`reset password error >>> `, error);
        alert(res?.message || res?.response?.data?.message);
      }
    },
  });

  const handleTogglePopup = () => {
    setShowPopup(false);
    navigate("/login");
  };

  return (
    <>
      <PasswordUpdateSuccessModal
        showPopup={showPopup}
        handleTogglePopup={handleTogglePopup}
      />
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-[350px] flex flex-col items-start gap-4"
      >
        <div className="w-full text-center">
          <img
            src="/image-placeholder.png"
            alt="image-placeholder"
            className="max-w-[146px] mx-auto"
          />
          <h2 className="font-semibold text-[32px] leading-none mt-8 mb-3">
            Set New Password
          </h2>
          <p className="text-[var(--secondary-color)]">
            Enter new password to continue
          </p>
        </div>

        <div className="w-full space-y-3 mt-4">
          <PasswordField
            name={`password`}
            placeholder={`New Password`}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
          />
          <PasswordField
            name={`confirmPassword`}
            placeholder={`Confirm Password`}
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
          />

          <div className="pt-2">
            <Button type={"submit"} title={`Save`} />
          </div>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
