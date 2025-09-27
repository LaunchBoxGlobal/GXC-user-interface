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
import Cookies from "js-cookie";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const location = useLocation();
  const { email, otp } = location?.state || {};
  const [loading, setLoading] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState(
    Cookies.get("verificationEmail")
  );

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .max(25, "Password cannot be more than 25 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(
          /[@$!%*?&^#_.-]/,
          "Password must contain at least one special character"
        )
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords do not match")
        .required("Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const res = await axios.post(`${BASE_URL}/auth/reset-password`, {
          email: verificationEmail,
          code: otp,
          password: values?.password,
        });

        console.log("reset password response >>> ", res?.data);

        if (res?.data?.success) {
          // alert(res?.data?.message);
          resetForm();
          setShowPopup(true);
          Cookies.remove("verificationEmail");
        }
      } catch (error) {
        console.log(`reset password error >>> `, error);
        alert(res?.message || res?.response?.data?.message);
      } finally {
        setLoading(false);
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
          <h2 className="font-semibold text-[32px] leading-none mt-8 mb-3">
            Set New Password
          </h2>
          <p className="text-[var(--secondary-color)]">
            Enter new password to continue
          </p>
        </div>

        <div className="w-full space-y-3 mt-4">
          <div className="w-full space-y-1">
            <label htmlFor="password" className="text-sm font-medium">
              New Password
            </label>
            <PasswordField
              name={`password`}
              placeholder={`New Password`}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.password}
              touched={formik.touched.password}
            />
          </div>
          <div className="w-full space-y-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </label>
            <PasswordField
              name={`confirmPassword`}
              placeholder={`Confirm Password`}
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
            />
          </div>

          <div className="pt-2">
            <Button type={"submit"} title={`Save`} isLoading={loading} />
          </div>
        </div>
      </form>
    </>
  );
};

export default ChangePassword;
