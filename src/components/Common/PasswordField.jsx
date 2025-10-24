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
  label,
}) => {
  const [showPass, setShowPass] = useState(false);
  const showError = touched && error;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor="confirmPassword" className="text-sm font-medium">
          {label}
        </label>
      )}
      <div
        className={`w-full bg-[var(--secondary-bg)] border h-[49px] px-[15px] py-[14px] rounded-[8px] flex items-center justify-between  ${
          showError ? "border-red-500" : "border-[var(--secondary-bg)]"
        }`}
      >
        <input
          type={showPass ? `text` : `password`}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="w-full text-[#6D6D6D] outline-none bg-transparent font-normal"
        />

        <button type="button" onClick={() => setShowPass((prev) => !prev)}>
          {showPass ? (
            <FaRegEye className="text-gray-400" />
          ) : (
            <FaRegEyeSlash className="text-gray-400" />
          )}
        </button>
      </div>
      {showError && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default PasswordField;
