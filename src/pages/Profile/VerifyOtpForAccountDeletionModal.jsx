import React, { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleLogout } from "../../utils/handleLogout";
import { useNavigate } from "react-router-dom";

const VerifyOtpForAccountDeletionModal = ({ onClose, showModal }) => {
  const { user } = useAppContext();
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(60);
  const inputsRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (showModal) {
      setTimer(60);
      setOtp(Array(6).fill(""));
    }
  }, [showModal]);

  // Handle input change
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // move to next input automatically
    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  // Handle backspace and arrow movement
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  // Handle paste (auto fill OTP)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pastedData.some((ch) => isNaN(ch))) return;

    const newOtp = [...otp];
    pastedData.forEach((val, i) => (newOtp[i] = val));
    setOtp(newOtp);

    // Move focus to last filled input
    const lastIndex = pastedData.length - 1;
    if (lastIndex >= 0 && lastIndex < 6) {
      inputsRef.current[lastIndex].focus();
    }
  };

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) return;
    const countdown = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleResendOtp = async () => {
    setResending(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/request-delete-account`,
        {},
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (res?.data?.success) {
        enqueueSnackbar("OTP resent successfully", { variant: "success" });
        setTimer(60);
      }
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setResending(false);
    }
  };

  // Resend OTP API
  const handleResend = async () => {
    try {
      setResending(true);
      await axios.post(`${BASE_URL}/auth/resend-otp`, { email: user?.email });
      enqueueSnackbar("OTP resent successfully", { variant: "success" });
      setTimer(60);
    } catch (error) {
      enqueueSnackbar("Failed to resend OTP", { variant: "error" });
    } finally {
      setResending(false);
    }
  };

  // Verify OTP API
  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length < 6) {
      // setErrorMessage("Please enter a 6-digit OTP");
      enqueueSnackbar("Please enter a 6-digit OTP", { variant: "error" });
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL}/auth/delete`,
        {
          email: user?.email,
          code: otpCode,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
      if (res?.data?.success) {
        enqueueSnackbar(
          res?.data?.message || "Your account has been deleted successfully.",
          { variant: "success" }
        );
        onClose?.();
        handleLogout();
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      enqueueSnackbar(
        error?.response?.data?.message ||
          error?.message ||
          "Invalid OTP, please try again",
        { variant: "error" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    showModal && (
      <div className="w-full h-screen bg-[rgba(0,0,0,0.5)] fixed inset-0 z-50 flex items-center justify-center">
        <div className="bg-white w-full max-w-[471px] rounded-[32px] p-6 relative">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-[24px] font-semibold leading-none">
              Delete Account
            </h2>
            <button type="button" onClick={onClose}>
              <img
                src="/close-icon.png"
                alt="close icon"
                width={20}
                height={20}
              />
            </button>
          </div>

          <p className="mt-2">
            The code was sent to{" "}
            <span className="font-medium">{user?.email}</span>
          </p>

          <div
            className="w-full flex items-center justify-center gap-2 mt-4"
            onPaste={handlePaste}
          >
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                className="w-full h-[49px] border border-gray-300 rounded-[12px] outline-none text-center text-lg font-normal"
              />
            ))}
          </div>

          <p className="mt-3 mb-6 text-start text-sm">
            Didn’t receive code?{" "}
            {timer > 0 ? (
              <span className="font-medium text-gray-500">
                Resend code in {timer}s
              </span>
            ) : (
              <button
                type="button"
                disabled={resending}
                onClick={() => handleResendOtp()}
                className="font-medium text-[var(--button-bg)] hover:underline disabled:opacity-50"
              >
                {resending ? "Resending..." : "Resend code"}
              </button>
            )}
          </p>

          <button
            type="button"
            className="button w-full"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    )
  );
};

export default VerifyOtpForAccountDeletionModal;
