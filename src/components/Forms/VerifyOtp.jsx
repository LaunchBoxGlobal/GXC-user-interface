import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
const PAGETITLE = import.meta.env.VITE_PAGE_TITLE;
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import ResendOtp from "./ResendOtp";
import Cookies from "js-cookie";

const VerifyOtp = () => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { page } = location?.state || {};
  const [email, setEmail] = useState(Cookies.get("email"));

  useEffect(() => {
    // const email = Cookies.get("email");

    document.title = `Verify OTP - ${PAGETITLE}`;
  }, []);

  const formik = useFormik({
    initialValues: {
      otp: ["", "", "", "", "", ""],
    },
    validationSchema: Yup.object({
      otp: Yup.array()
        .test("complete", "OTP is required", (arr) =>
          arr.every((digit) => digit !== "")
        )
        .test("valid", "OTP must be 6 digits", (arr) =>
          /^\d{6}$/.test(arr.join(""))
        ),
    }),
    onSubmit: async (values, { resetForm }) => {
      const otp = values.otp.join("");

      const body = page === "/signup" ? { code: otp } : { code: otp, email };

      try {
        const url =
          page === "/signup"
            ? `${BASE_URL}/auth/verify-email`
            : `${BASE_URL}/auth/verify-reset-code`;

        const res = await axios.post(url, body, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        const redirect = searchParams?.get("redirect");
        console.log("redirect >>> ", redirect);
        if (res?.data?.success) {
          resetForm();
          Cookies.set("isVerified", true);

          if (page == "/signup") {
            navigate(
              `/email-verification${redirect ? `?redirect=${redirect}` : ""}`,
              {
                state: { page: "/email-verification" },
              }
            );
          } else if (page == "/forgot-password") {
            navigate(`/change-password`, {
              state: { email, otp },
            });
          }
        }
      } catch (error) {
        console.error("verify email error:", error);
        alert(error?.message || error.response?.data?.message);
      }
    },
  });

  const handleChange = (e, idx) => {
    const { value } = e.target;

    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...formik.values.otp];
      newOtp[idx] = value;
      formik.setFieldValue("otp", newOtp);

      if (value && idx < 5) {
        inputRefs.current[idx + 1].focus();
      }
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !formik.values.otp[idx] && idx > 0) {
      inputRefs.current[idx - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("Text").slice(0, 6).split("");

    if (pastedData.every((ch) => /^[0-9]$/.test(ch))) {
      const newOtp = Array(6).fill("");
      pastedData.forEach((ch, i) => {
        newOtp[i] = ch;
      });
      formik.setFieldValue("otp", newOtp);
      newOtp.forEach((val, i) => {
        if (inputRefs.current[i]) inputRefs.current[i].value = val;
      });
    }
  };

  const handleResendOtp = async () => {
    try {
      const res = await axios.post(`${BASE_URL}/auth/resend-otp`, {});

      if (res?.data?.success) {
        alert(res.data.message || "OTP resent successfully");
      } else {
        alert(res.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      alert(
        error?.response?.data?.message || "Something went wrong, try again"
      );
    }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-[350px] flex flex-col items-start gap-4"
    >
      <div className="w-full">
        <img
          src="/image-placeholder.png"
          alt=""
          className="w-[107px] h-[107px] rounded-full object-contain mx-auto"
        />
      </div>

      <div className="w-full text-center space-y-3 mt-4">
        <h1 className="font-semibold text-[32px] leading-none">Verify OTP</h1>
        <p className="text-[var(--secondary-color)]">
          The code was sent to{" "}
          {email && <span className="text-black font-medium">{email}</span>}
        </p>
      </div>

      <div className="w-full space-y-3 mt-3">
        <div className="w-full flex justify-between" onPaste={handlePaste}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <input
              key={i}
              type="text"
              maxLength="1"
              ref={(el) => (inputRefs.current[i] = el)}
              value={formik.values.otp[i]}
              onChange={(e) => handleChange(e, i)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              className={`w-[49px] border h-[49px] text-center text-lg font-medium rounded-[8px] outline-none 
                ${formik.errors.otp ? "border-red-500" : "border-[#D9D9D9]"}`}
            />
          ))}
        </div>

        {/* {formik.errors.otp && (
          <p className="text-red-500 text-sm">{formik.errors.otp}</p>
        )} */}

        <div className="pt-3">
          <Button type="submit" title="Verify" />
        </div>
      </div>

      <div className="w-full mt-2 flex flex-col items-center gap-4">
        <div className="w-full flex items-center justify-center gap-1">
          <p className="text-[var(--secondary-color)]">
            Didn't receive the code yet?{" "}
          </p>
          <ResendOtp />
        </div>
      </div>
    </form>
  );
};

export default VerifyOtp;
