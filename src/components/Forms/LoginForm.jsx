import { useEffect } from "react";
import TextField from "../Common/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import PasswordField from "../Common/PasswordField";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
const PAGETITLE = import.meta.env.VITE_PAGE_TITLE;
import Cookies from "js-cookie";

const LoginForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const redirect = searchParams?.get("redirect");

  useEffect(() => {
    document.title = `Login - ${PAGETITLE}`;
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",

      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      resetForm();
      try {
        const res = await axios.post(`${BASE_URL}/auth/login`, values, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res?.data?.success) {
          Cookies.set("userToken", res?.data?.data?.token);
          Cookies.set("user", JSON.stringify(res?.data?.data?.user));
          resetForm();
          if (redirect) {
            navigate(redirect.startsWith("/") ? redirect : `/${redirect}`);
          } else {
            navigate("/");
          }
        }
      } catch (error) {
        console.error("login error:", error);
        alert(error.response?.data?.message || error?.message);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-[350px] flex flex-col items-start gap-4"
    >
      <img
        src="/GiveXchangenewlogo.png"
        alt=""
        className="mx-auto w-[167px] lg:w-[267px]"
      />

      <div className="w-full text-center space-y-3">
        <h2 className="font-semibold text-[32px] leading-none">Welcome Back</h2>
        <p className="text-[var(--secondary-color)]">
          Please enter details to continue
        </p>
      </div>

      <div className="w-full flex flex-col items-start gap-4 mt-3">
        <div className="w-full space-y-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email Address
          </label>
          <TextField
            type="text"
            name="email"
            placeholder="Email Address"
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
            name={`password`}
            placeholder={`Password`}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
          />
        </div>

        <div className="w-full text-end">
          <Link to={`/forgot-password`} className="text-xs font-medium">
            Forgot Password?
          </Link>
        </div>

        <div className="pt-2 w-full">
          <Button type={"submit"} title={`Login`} />
        </div>
      </div>

      <div className="w-full flex items-center justify-between gap-6 mt-4">
        <div className="w-full border border-gray-300" />
        <p className="text-gray-400 font-medium">OR</p>
        <div className="w-full border border-gray-300" />
      </div>

      <div className="w-full mt-2 flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-center gap-1">
          <p className="text-[var(--secondary-color)]">
            Don't have an account?{" "}
          </p>
          <Link
            to={redirect ? `/signup?redirect=${redirect}` : "/signup"}
            className="font-medium"
          >
            Sign Up
          </Link>
        </div>
        {/* <Link
          to={`/login`}
          className="text-sm font-medium flex items-center gap-1"
        >
          <div className="w-[18px] h-[18px] bg-black rounded-full flex items-center justify-center">
            <RiArrowLeftSLine className="text-white text-base" />
          </div>
          Back
        </Link> */}
      </div>
    </form>
  );
};

export default LoginForm;
