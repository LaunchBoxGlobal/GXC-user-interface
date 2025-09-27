import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import Cookies from "js-cookie";
import { getToken } from "../../utils/getToken";
import { useState } from "react";

const ResendOtp = ({ email, page }) => {
  // const [email, setEmail] = useState(Cookies.get("email"));
  const [loading, setLoading] = useState(false);

  const handleResendOtp = async () => {
    const email = Cookies.get("email");
    setLoading(true);
    try {
      const url =
        page === "/login" || page === "/signup"
          ? `${BASE_URL}/auth/resend-verification`
          : `${BASE_URL}/auth/forgot-password`;
      const res = await axios.post(
        url,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      if (res?.data?.success) {
        alert(res?.data?.message);
      }
    } catch (error) {
      console.error("verify email error:", error);
      alert(error?.message || error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      type="button"
      disabled={loading}
      className="font-medium text-[var(--button-bg)]"
      onClick={() => handleResendOtp()}
    >
      Resend
    </button>
  );
};

export default ResendOtp;
