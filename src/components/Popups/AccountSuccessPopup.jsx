import React from "react";
import { useNavigate } from "react-router-dom";

const AccountSuccessPopup = ({ showPopup, togglePopup, redirect }) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate(redirect ? redirect : "/");
    togglePopup();
  };
  return (
    showPopup && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center px-5 py-5">
        <div className="w-full max-w-[471px] bg-white p-7 rounded-[24px]">
          <div className="w-full text-center">
            <img
              src="/green-check.png"
              alt="green-check.png"
              className="max-w-[107px] object-contain mx-auto"
            />
            <h1 className="font-semibold text-[32px] leading-[1.3] mt-7 mb-6">
              Account created <br /> Successfully
            </h1>
            <button
              type="button"
              onClick={() => handleNavigate()}
              // to={`/`}
              className="bg-[var(--button-bg)] text-white rounded-[8px] font-medium text-center h-[49px] block py-[14px] w-full"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default AccountSuccessPopup;
