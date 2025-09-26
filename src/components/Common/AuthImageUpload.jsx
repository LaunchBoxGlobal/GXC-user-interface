import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

const AuthImageUpload = ({ name, setFieldValue, error }) => {
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFieldValue(name, file);
    }
  };

  return (
    <div className="w-full flex items-center justify-start gap-4">
      <label
        htmlFor="profileImage"
        className="bg-[var(--secondary-bg)] text-slate-500 font-semibold text-base w-[100px] h-[100px] rounded-full flex items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed overflow-hidden"
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <FiPlus className="text-3xl" />
        )}
        <input
          type="file"
          id="profileImage"
          accept="image/*"
          onChange={handleImageChange}
          className="hidden"
        />
      </label>

      <div className="">
        <label
          htmlFor="profileImage"
          className={`underline text-[15px] font-medium cursor-pointer ${
            !error ? "text-[var(--primary-blue)]" : "text-red-500"
          }`}
        >
          Upload Profile Picture
        </label>
        {error && <span className="text-xl text-red-500 font-medium">*</span>}
      </div>
    </div>
  );
};

export default AuthImageUpload;
