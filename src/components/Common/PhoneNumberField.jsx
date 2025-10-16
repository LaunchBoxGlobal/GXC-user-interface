import React, { useState } from "react";
import {
  parsePhoneNumberFromString,
  getCountries,
  getCountryCallingCode,
} from "libphonenumber-js";

const countries = getCountries();

const PhoneNumberField = ({
  name,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  touched,
  label,
  defaultCountry,
}) => {
  const [selectedCountry, setSelectedCountry] = useState(
    defaultCountry || "US"
  );

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);

    const callingCode = getCountryCallingCode(newCountry);
    const formatted = value.startsWith("+")
      ? value
      : `+${callingCode}${value.replace(/\D/g, "")}`;

    // Update parent (Formik)
    onChange({
      target: {
        name,
        value: formatted,
      },
    });
  };

  const handleNumberChange = (e) => {
    const number = e.target.value.replace(/\D/g, ""); // keep digits only
    const callingCode = getCountryCallingCode(selectedCountry);
    const fullNumber = `+${callingCode}${number}`;

    onChange({
      target: {
        name,
        value: fullNumber,
      },
    });
  };

  const displayedNumber = (() => {
    const code = getCountryCallingCode(selectedCountry);
    return value.replace(`+${code}`, "").replace(/\D/g, "");
  })();

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
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className="bg-transparent text-sm outline-none border-none w-[60px] cursor-pointer"
        >
          {countries.map((c) => (
            <option key={c} value={c}>
              +{getCountryCallingCode(c)}
            </option>
          ))}
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
