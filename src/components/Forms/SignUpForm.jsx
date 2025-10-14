import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import PasswordField from "../Common/PasswordField";
import TextField from "../Common/TextField";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { BASE_URL } from "../../data/baseUrl";
import { enqueueSnackbar } from "notistack";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const redirect = searchParams?.get("redirect");

  useEffect(() => {
    if (!redirect || redirect === "/" || redirect.trim() === "") {
      navigate("/login", { replace: true });
      return;
    }

    document.title = `Sign up - GiveXChange`;
  }, [redirect, navigate]);

  const formik = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
      profileImage: null,
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(3, "First name must contain at least 3 characters")
        .max(10, "First name must be 10 characters or less")
        .matches(
          /^[A-Za-z ]+$/,
          "First name must contain only letters and spaces"
        )
        .required("Name is required"),
      lastName: Yup.string()
        .min(3, "Last name must contain at least 3 characters")
        .max(10, "Last name must be 10 characters or less")
        .matches(
          /^[A-Za-z ]+$/,
          "Last name must contain only letters and spaces"
        )
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .matches(
          /^(?![._-])([a-zA-Z0-9._%+-]{1,64})@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
          "Please enter a valid email address"
        )
        .matches(
          /^(?!.*[._-]{2,})(?!.*\.\.).*$/,
          "Email cannot contain consecutive special characters"
        )
        .required("Email is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .max(25, "Password cannot be more than 25 characters")
        .matches(
          /[A-Z]/,
          "Password must contain at least one uppercase & one lowercase letter"
        )
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
        setLoading(true);
        const formData = new FormData();
        formData.append("firstName", values.firstName);
        formData.append("lastName", values.lastName);
        formData.append("email", values.email);
        formData.append("password", values.password);
        formData.append("userType", "regular_user");

        if (values.profileImage) {
          formData.append("profileImage", values.profileImage);
        }

        const res = await axios.post(`${BASE_URL}/auth/register`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (res?.data?.success) {
          Cookies.set("userEmail", values.email);
          Cookies.set("isUserEmailVerified", false);
          Cookies.set("userToken", res?.data?.data?.token);
          Cookies.set("user", JSON.stringify(res?.data?.data?.user));
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
        enqueueSnackbar(error.response?.data?.message || error.message, {
          autoHideDuration: 1500,
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-[400px] flex flex-col items-start gap-4"
    >
      <div className="w-full text-center space-y-3">
        <h1 className="font-semibold text-[32px] leading-none">Sign Up</h1>
        <p className="text-[var(--secondary-color)]">
          Please enter details to continue
        </p>
      </div>

      <div className="w-full space-y-3">
        <div className="w-full grid grid-cols-2 gap-2">
          <div className="w-full space-y-1">
            <label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </label>
            <TextField
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.firstName}
              touched={formik.touched.firstName}
            />
          </div>
          <div className="w-full space-y-1">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </label>
            <TextField
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.lastName}
              touched={formik.touched.lastName}
            />
          </div>
        </div>

        <div className="w-full space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>

          <TextField
            type="text"
            name="email"
            placeholder="Enter your email address"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
          />
        </div>

        <div className="w-full space-y-1">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <PasswordField
            name="password"
            placeholder="Enter your password"
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
            placeholder="Enter your password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
          />
        </div>

        <div className="pt-2">
          <Button type="submit" title="Sign Up" isLoading={loading} />
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
