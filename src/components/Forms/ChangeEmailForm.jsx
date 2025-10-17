import TextField from "../Common/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";
import { getToken } from "../../utils/getToken";

const ChangeEmailForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const redirect = searchParams?.get("redirect");
  const page = Cookies.get("page");

  useEffect(() => {
    document.title = `Change Email - GiveXChange`;
  }, []);

  const handleBack = () => {
    // if (redirect) {
    //   navigate(redirect);
    // } else {
    navigate(-1); // go back in history
    // }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email address is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      resetForm();
      setLoading(true);

      try {
        const res = await axios.post(
          `${BASE_URL}/auth/resend-verification`,
          { newEmail: values.email },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (res?.data?.success) {
          Cookies.set("userEmail", values.email);
          Cookies.set("isUserEmailVerified", false);
          resetForm();
          enqueueSnackbar(res?.data?.message, {
            variant: "success",
          });
          navigate(
            redirect ? `/verify-otp?redirect=${redirect}` : "/verify-otp",
            {
              state: {
                page: "/forgot-password",
                email: values.email,
              },
            }
          );
        }
      } catch (error) {
        console.error("verify email error:", error);
        enqueueSnackbar(error.response?.data?.message || error?.message, {
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
      className="w-full max-w-[350px] flex flex-col items-start gap-4"
    >
      <div className="w-full text-center">
        <h2 className="font-semibold text-[32px] leading-none mt-8 mb-3">
          Change Email Address
        </h2>
        <p className="text-[var(--secondary-color)]">
          Enter your new email address below
        </p>
      </div>

      <div className="w-full flex flex-col items-start gap-4 mt-4">
        <div className="w-full">
          <TextField
            type="text"
            name="email"
            placeholder="Email Address"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
            label={"Email Address"}
          />
        </div>

        <div className="pt-2 w-full">
          <Button type={"submit"} title={`Update`} isLoading={loading} />
        </div>
      </div>

      <div className="w-full mt-2 flex flex-col items-center gap-4">
        <button
          // to={redirect ? `${-1}?redirect=${redirect}` : -1}
          type="button"
          onClick={() => handleBack()}
          className="text-sm font-medium flex items-center gap-1 text-[var(--button-bg)]"
        >
          <div className="w-[18px] h-[18px] bg-[var(--button-bg)] rounded-full flex items-center justify-center">
            <RiArrowLeftSLine className="text-white text-base" />
          </div>
          Back
        </button>
      </div>
    </form>
  );
};

export default ChangeEmailForm;
