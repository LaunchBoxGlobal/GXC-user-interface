import { useState } from "react";
import { getCountryCallingCode } from "libphonenumber-js";

const PhoneNumberField = ({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  label,
}) => {
  const selectedCountry = "US"; // 🔒 LOCKED to United States
  const callingCode = getCountryCallingCode(selectedCountry);

  const handleNumberChange = (e) => {
    const number = e.target.value.replace(/\D/g, ""); // digits only
    const fullNumber = `+${callingCode}${number}`;

    onChange({
      target: {
        name,
        value: fullNumber,
      },
    });
  };

  const displayedNumber = value
    .replace(`+${callingCode}`, "")
    .replace(/\D/g, "");

  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
      )}

      <div
        className={`flex items-center gap-2 border rounded-[10px] px-3 h-[49px] bg-[var(--secondary-bg)] ${
          error && touched ? "border-red-500" : "border-[#f5f5f5]"
        }`}
      >
        {/* Country code selector but fully disabled */}
        <select
          value={selectedCountry}
          disabled={true}
          className="bg-transparent text-sm outline-none border-none w-[60px] cursor-not-allowed pointer-events-none"
        >
          <option value="US">+{callingCode}</option>
        </select>

        <input
          type="tel"
          value={displayedNumber}
          onChange={handleNumberChange}
          onBlur={onBlur}
          placeholder={placeholder || "Enter phone number"}
          className="flex-1 bg-transparent outline-none text-sm font-normal"
        />
      </div>

      {error && touched && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default PhoneNumberField;
