import React, { useState } from "react";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

const PasswordField = ({
  value,
  onChange,
  placeholder,
  name,
  onBlur,
  error,
  touched,
}) => {
  const [showPass, setShowPass] = useState(false);
  return (
    <div className="w-full ">
      <div
        className={`w-full bg-white border h-[49px] px-[15px] py-[14px] rounded-[8px] flex items-center justify-between  ${
          error && touched ? "border-red-500" : "border-[#D9D9D9]"
        }`}
      >
        <input
          type={showPass ? `text` : `password`}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="w-full text-[#212121] outline-none"
        />

        <button type="button" onClick={() => setShowPass((prev) => !prev)}>
          {showPass ? (
            <FaRegEye className="text-gray-400" />
          ) : (
            <FaRegEyeSlash className="text-gray-400" />
          )}
        </button>
      </div>
      {error && touched && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default PasswordField;
