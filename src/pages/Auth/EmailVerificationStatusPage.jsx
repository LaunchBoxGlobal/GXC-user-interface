import React, { useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
const PAGETITLE = import.meta.env.VITE_PAGE_TITLE;

const EmailVerificationStatusPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const redirect = searchParams?.get("redirect");

  const handleNavigate = () => {
    if (redirect) {
      navigate(redirect.startsWith("/") ? redirect : `/${redirect}`);
    } else {
      navigate("/add-payment-info");
    }
  };

  useEffect(() => {
    document.title = `Account verified - ${PAGETITLE}`;
  }, []);

  return (
    <div className="w-full max-w-[350px]">
      <div className="w-full text-center">
        <img
          src="/check-icon.png"
          alt="check-icon"
          className="max-w-[107px] object-contain mx-auto"
        />
        <h1 className="font-semibold text-[32px] leading-[1.3] mt-7 mb-6">
          Email Address <br /> Verified Successfully
        </h1>
        <button
          // to={`/add-payment-info`}
          type="button"
          onClick={() => handleNavigate()}
          className="bg-[var(--button-bg)] text-white rounded-[8px] font-medium text-center h-[49px] block py-[14px] w-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default EmailVerificationStatusPage;
