import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import PasswordField from "../Common/PasswordField";
import TextField from "../Common/TextField";
import AuthImageUpload from "../Common/AuthImageUpload";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useEffect } from "react";
const PAGETITLE = import.meta.env.VITE_PAGE_TITLE;
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../data/baseUrl";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    document.title = `Sign up - ${PAGETITLE}`;
  }, []);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      // phoneNumber: "",
      password: "",
      confirmPassword: "",
      profileImage: null,
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must contain at least 3 characters")
        .max(30, "Name must be 30 characters or less")
        .matches(
          /^[A-Z][a-zA-Z ]*$/,
          "Name must start with a capital letter and contain only letters and spaces"
        )
        .required("Name is required"),
      // phoneNumber: Yup.string()
      //   .matches(/^[0-9]{11}$/, "Phone number must contain 11 digits")
      //   .required("Enter your phone number"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
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
        .required("Confirm password is required"),
      profileImage: Yup.mixed().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const formData = new FormData();
        formData.append("fullName", values.name);
        formData.append("email", values.email);
        formData.append("password", values.password);
        // formData.append("phone", values.phoneNumber);
        formData.append("userType", "regular_user");

        if (values.profileImage) {
          formData.append("profileImage", values.profileImage);
        }

        const res = await axios.post(`${BASE_URL}/auth/register`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const redirect = searchParams?.get("redirect");
        if (res?.data?.success) {
          Cookies.set("userEmail", values.email);
          Cookies.set("isVerified", false);
          Cookies.set("userToken", res?.data?.data?.token);
          Cookies.set("user", JSON.stringify(res?.data?.data?.user));
          // Cookies.set("verification")
          resetForm();

          navigate(`/verify-otp${redirect ? `?redirect=${redirect}` : ""}`, {
            state: {
              page: "/signup",
              email: values.email,
            },
          });
        }
      } catch (error) {
        console.error("Sign up error:", error.response?.data);
        alert(error.response?.data?.message || error.message);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-[350px] flex flex-col items-start gap-4"
    >
      <div className="w-full text-center space-y-3">
        <h1 className="font-semibold text-[32px] leading-none">Sign Up</h1>
        <p className="text-[var(--secondary-color)]">
          Please enter details to continue
        </p>
      </div>

      {/* <div className="w-full h-[100px] flex flex-col items-center justify-center gap-2 my-3">
        <AuthImageUpload
          name="profileImage"
          setFieldValue={formik.setFieldValue}
          error={
            formik.errors.profileImage ? formik.touched.profileImage : null
          }
        />
      </div> */}

      <div className="w-full space-y-3">
        <div className="w-full space-y-1">
          <label htmlFor="name" className="text-sm font-medium">
            Full Name
          </label>
          <TextField
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.name}
            touched={formik.touched.name}
          />
        </div>

        <div className="w-full space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>

          <TextField
            type="text"
            name="email"
            placeholder="Enter email address"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
          />
        </div>

        {/* <div className="w-full space-y-1">
          <label htmlFor="phoneNumber" className="text-sm font-medium">
            Phone Number
          </label>
          <TextField
            type="number"
            name="phoneNumber"
            placeholder="Enter your phone number"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.phoneNumber}
            touched={formik.touched.phoneNumber}
          />
        </div> */}
        <div className="w-full space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <PasswordField
            name="password"
            placeholder="Password"
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
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" title="Sign Up" />
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-6 mt-4">
        <div className="w-full border border-gray-400" />
        <p className="text-gray-500 font-medium">OR</p>
        <div className="w-full border border-gray-400" />
      </div>

      <div className="w-full mt-2 flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-center gap-1">
          <p className="text-[var(--secondary-color)]">
            Already have an account?{" "}
          </p>
          <Link to={`/login`} className="font-medium text-[var(--button-bg)]">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
