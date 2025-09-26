import React from "react";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import Cookies from "js-cookie";

const ResendOtp = ({ email }) => {
  // const [email, setEmail] = useState(Cookies.get("email"));

  const handleResendOtp = async () => {
    const email = Cookies.get("email");
    try {
      const res = await axios.post(
        `${BASE_URL}/auth/forgot-password`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("verify email response >>> ", res?.data);

      if (res?.data?.success) {
        alert(res?.data?.message);
      }
    } catch (error) {
      console.error("verify email error:", error);
      alert(error?.message || error.response?.data?.message);
    }
  };
  return (
    <button
      type="button"
      className="font-medium"
      onClick={() => handleResendOtp()}
    >
      Resend
    </button>
  );
};

export default ResendOtp;
