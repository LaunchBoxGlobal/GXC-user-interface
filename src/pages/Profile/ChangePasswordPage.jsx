import { useFormik } from "formik";
import PasswordField from "../../components/Common/PasswordField";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import * as Yup from "yup";
import { getToken } from "../../utils/getToken";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useUser } from "../../context/userContext";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { checkIamAlreadyMember } = useUser();

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required("Enter your current password"),
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
        .required("Enter your new password"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords do not match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        checkIamAlreadyMember();
        const res = await axios.post(
          `${BASE_URL}/auth/change-password`,
          {
            password: values?.password.trim(),
            oldPassword: values.currentPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        // console.log("change password:", res?.data);

        if (res?.data?.success) {
          resetForm();
          enqueueSnackbar("Password changed successfully", {
            variant: "success",
          });
        }
      } catch (error) {
        console.error("change password error:", error.response?.data);
        enqueueSnackbar(error?.response?.data?.message || error?.message, {
          variant: "error",
        });
        if (error?.response?.status === 401) {
          Cookies.remove("token");
          Cookies.remove("user");
          navigate("/login");
        }
      }
    },
  });

  return (
    <div className="w-full pt-2">
      <h1 className="font-semibold text-[24px]">Change Password</h1>
      <div className="w-full border my-5" />

      <form onSubmit={formik.handleSubmit} className="w-full space-y-5 mt-5">
        <PasswordField
          name="currentPassword"
          placeholder="Current Password"
          value={formik.values.currentPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.currentPassword}
          touched={formik.touched.currentPassword}
        />
        <PasswordField
          name="password"
          placeholder="New Password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
        />

        <PasswordField
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.confirmPassword}
          touched={formik.touched.confirmPassword}
        />

        <div className="w-full flex justify-end mt-5">
          <button
            type="submit"
            className="bg-[var(--button-bg)] button max-w-[150px]"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
