import { enqueueSnackbar } from "notistack";
import React from "react";
import { IoClose } from "react-icons/io5";

const MarkItemMissingImageUpload = ({ images, setImages }) => {
  const handleFileSelect = (e) => {
    let files = Array.from(e.target.files);

    let validFiles = [];

    files.forEach((file) => {
      const isValidType = ["image/jpeg", "image/jpg", "image/png"].includes(
        file.type
      );
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (!isValidType) {
        enqueueSnackbar("Only JPG, JPEG, PNG allowed", {
          variant: "error",
        });
        return;
      }

      if (!isValidSize) {
        enqueueSnackbar("Each image must be under 5MB", {
          variant: "error",
        });
        return;
      }

      validFiles.push(file);
    });

    if (images.length + validFiles.length > 5) {
      enqueueSnackbar("Maximum 5 images allowed", {
        variant: "error",
      });
      return;
    }

    setImages([...images, ...validFiles]);
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  return (
    <div className="w-full mt-4">
      {/* Upload Box */}
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full min-h-[65px] bg-[#FBFBFB] border-2 border-dashed border-[var(--button-bg)] rounded-[12px] cursor-pointer"
        >
          <div className="w-full flex flex-col items-center justify-center text-body pt-5 pb-6">
            <img src="/picture-icon.png" alt="image icon" width={30} />
            <p className="mt-3 text-sm">
              <span className="text-[var(--button-bg)] font-medium">
                Click to upload image
              </span>
            </p>
            <p className="text-xs mt-1 text-gray-500">
              Max 5 images • JPG, PNG • 5MB each
            </p>
          </div>

          <input
            id="dropzone-file"
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
          />
        </label>
      </div>

      {/* PREVIEW IMAGES */}
      {images && images?.length > 0 && (
        <div className="w-full flex flex-wrap gap-3 mt-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative w-[40px] h-[40px] rounded-md border "
            >
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                className="w-full h-full object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute -top-1 -right-1 bg-black/70 text-white rounded-full w-4 h-4 flex items-center justify-center"
              >
                <IoClose className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarkItemMissingImageUpload;
