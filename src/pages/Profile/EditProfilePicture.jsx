import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";

const EditProfilePicture = ({ name, setFieldValue, error, imagePreview }) => {
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 👇 Validate file type
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setFileError("Only PNG, JPG, or JPEG images are allowed.");
      setPreview(null);
      setFieldValue(name, null);
      return;
    }

    // 👇 Clear error and set preview
    setFileError(null);
    setPreview(URL.createObjectURL(file));
    setFieldValue(name, file);
  };

  return (
    <div className="w-full flex items-center justify-start gap-4">
      <label
        htmlFor="profileImage"
        className={`bg-[var(--secondary-bg)] text-slate-500 font-semibold text-base w-[100px] h-[100px] rounded-full flex items-center justify-center cursor-pointer border-2 border-dashed overflow-hidden ${
          fileError || error ? "border-red-500" : "border-gray-300"
        }`}
      >
        {preview || imagePreview ? (
          <img
            src={preview || imagePreview}
            alt="Profile Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <FiPlus className="text-3xl" />
        )}
        <input
          type="file"
          id="profileImage"
          accept="image/png, image/jpeg, image/jpg" // 👈 restrict file picker
          onChange={handleImageChange}
          className="hidden"
        />
      </label>

      <div>
        <label
          htmlFor="profileImage"
          className={`underline text-[15px] font-medium cursor-pointer ${
            fileError || error ? "text-red-500" : "text-[var(--primary-blue)]"
          }`}
        >
          Upload Profile Picture
        </label>

        {/* 👇 Display error message */}
        {(fileError || error) && (
          <p className="text-red-500 text-xs mt-1">
            {fileError || "Profile picture is required"}
          </p>
        )}
      </div>
    </div>
  );
};

export default EditProfilePicture;
