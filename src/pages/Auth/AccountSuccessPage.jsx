import React from "react";
import { Link } from "react-router-dom";

const AccountSuccessPage = () => {
  return (
    <div className="w-full max-w-[350px]">
      <div className="w-full text-center">
        <img
          src="/black-check-icon.png"
          alt="/black-check-icon.png"
          className="max-w-[107px] object-contain mx-auto"
        />
        <h1 className="font-semibold text-[32px] leading-[1.3] mt-7 mb-6">
          Account created <br /> Successfully
        </h1>
        <Link
          to={`/home`}
          className="bg-[var(--button-bg)] text-white rounded-[8px] font-medium text-center h-[49px] block py-[14px]"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default AccountSuccessPage;
