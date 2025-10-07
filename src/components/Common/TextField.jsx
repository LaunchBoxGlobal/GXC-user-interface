import React from "react";

const TextField = ({
  name,
  value,
  onChange,
  onBlur,
  type,
  placeholder,
  error,
  touched,
  label,
  disabled,
}) => {
  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <label htmlFor="" className="text-sm font-medium">
          {label}
        </label>
      )}
      <input
        type={type}
        autoComplete="off"
        name={name}
        disabled={disabled}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`w-full border h-[49px] bg-[var(--secondary-bg)] px-[15px] py-[14px] rounded-[8px] outline-none
          ${
            error && touched ? "border-red-500" : "border-[var(--secondary-bg)]"
          }`}
      />
      {error && touched && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default TextField;
