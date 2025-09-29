import React from "react";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";

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
  const handlePhoneChange = (phone) => {
    // Update Formik state manually
    if (onChange) {
      onChange({
        target: {
          name,
          value: phone,
        },
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium">
          {label}
        </label>
      )}

      <div
        className={`w-full h-[49px] rounded-[10px] ${
          error && touched ? "border border-red-500" : "border border-[#D9D9D9]"
        }`}
      >
        <PhoneInput
          country={"us"}
          value={value}
          onChange={handlePhoneChange}
          inputProps={{
            name,
            onBlur,
            placeholder: placeholder || "+000 0000 00",
          }}
          containerStyle={{
            width: "100%",
            height: "100%",
            borderRadius: "12px",
          }}
          inputStyle={{
            width: "100%",
            height: "100%",
            outline: "none",
            border: "none",
            fontSize: "14px",
            color: "gray",
            padding: "10px 50px",
            margin: "0",
            background: "white",
            borderRadius: "10px",
          }}
          buttonStyle={{
            border: "none",
            background: "transparent",
          }}
          className="text-sm font-normal outline-none"
        />
      </div>

      {error && touched && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

export default PhoneNumberField;
