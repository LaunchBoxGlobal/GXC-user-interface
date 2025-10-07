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
import EmailVerificationPopup from "../Popups/EmailVerificationPopup";
import { useAppContext } from "../../context/AppContext";
import { enqueueSnackbar } from "notistack";

const VerifyOtp = () => {
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { page } = location?.state || {};
  const redirect = searchParams?.get("redirect");
  const { showEmailVerificationPopup, setShowEmailVerificationPopup } =
    useAppContext();
  const [loading, setLoading] = useState(false);
  const [userOtp, setUserOtp] = useState(null);
  const userEmail = Cookies.get("userEmail");

  const toggleEmailVerificationPopup = () => {
    setShowEmailVerificationPopup((prev) => !prev);
  };

  const handleNavigate = () => {
    if (page === "/signup") {
      navigate(`/complete-profile${redirect ? `?redirect=${redirect}` : ""}`, {
        state: { page: "/verify-otp" },
      });
      toggleEmailVerificationPopup();
    } else if (page == "/forgot-password") {
      navigate(`/change-password${redirect && `?redirect=${redirect}`}`, {
        state: { email: userEmail, otp: userOtp },
      });
      toggleEmailVerificationPopup();
    } else if (page === "/login") {
      navigate("/");
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    document.title = `Verify OTP - GiveXChange`;
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
      if (!otp) {
        return;
      }
      setLoading(true);

      const body =
        page === "/signup" ? { code: otp } : { code: otp, email: userEmail };

      try {
        const url =
          page === "/signup"
            ? `${BASE_URL}/auth/verify-email`
            : page === "/login"
            ? `${BASE_URL}/auth/verify-email`
            : `${BASE_URL}/auth/verify-reset-code`;

        const res = await axios.post(url, body, {
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res?.data?.success) {
          setUserOtp(otp);
          resetForm();
          toggleEmailVerificationPopup();
          Cookies.set("isVerified", true);
        }
      } catch (error) {
        enqueueSnackbar(
          error?.message || error.response?.data?.message || error?.message,
          {
            variant: "error",
            autoHideDuration: 1500,
          }
        );
      } finally {
        setLoading(false);
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

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-[370px] flex flex-col items-start gap-4"
      >
        <div className="w-full text-center space-y-3 mt-4">
          <h1 className="font-semibold text-[32px] leading-none">Verify OTP</h1>
          {userEmail && (
            <p className="text-[var(--secondary-color)] flex justify-center flex-wrap gap-1">
              The code was sent to{" "}
              <span className="text-black font-medium">{userEmail}</span>
            </p>
          )}
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
            <Button type="submit" title="Verify" isLoading={loading} />
          </div>
        </div>

        <div className="w-full mt-2 flex flex-col items-center gap-4">
          <div className="w-full flex items-center justify-center gap-1">
            <p className="text-[var(--secondary-color)]">
              Didn't receive the code yet?{" "}
            </p>
            <ResendOtp page={page} email={userEmail || email} />
          </div>
        </div>
      </form>

      <EmailVerificationPopup
        showPopup={showEmailVerificationPopup}
        togglePopup={handleNavigate}
      />
    </>
  );
};

export default VerifyOtp;
