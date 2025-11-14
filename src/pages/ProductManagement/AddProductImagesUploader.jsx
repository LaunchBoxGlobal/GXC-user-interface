import { enqueueSnackbar } from "notistack";

const AddProductImagesUploader = ({
  formik,
  previewImages,
  setPreviewImages,
  loading,
}) => {
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    const maxSize = 5 * 1024 * 1024;
    const maxImages = 5;

    let shownInvalidExt = false;
    let shownInvalidType = false;
    let shownInvalidSize = false;

    const validFiles = files.filter((file) => {
      const fileExt = file.name.split(".").pop().toLowerCase();
      const isValidType = allowedTypes.includes(file.type);
      const isValidExt = ["png", "jpg", "jpeg"].includes(fileExt);
      const isValidSize = file.size <= maxSize;

      if (!isValidExt && !shownInvalidExt) {
        enqueueSnackbar("Invalid extensions (PNG/JPG/JPEG only)", {
          variant: "warning",
        });
        shownInvalidExt = true;
      }
      if (!isValidType && !shownInvalidType) {
        enqueueSnackbar("Unsupported file type", { variant: "warning" });
        shownInvalidType = true;
      }
      if (!isValidSize && !shownInvalidSize) {
        enqueueSnackbar("Some files exceed 5MB size limit", {
          variant: "warning",
        });
        shownInvalidSize = true;
      }
      return isValidType && isValidExt && isValidSize;
    });

    e.target.value = "";

    const combinedImages = [...formik.values.productImages, ...validFiles];

    if (combinedImages.length > maxImages) {
      enqueueSnackbar(`You can only upload up to ${maxImages} images.`, {
        variant: "error",
      });
    }

    const newImages = combinedImages.slice(0, maxImages);
    formik.setFieldValue("productImages", newImages);

    const previews = newImages.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formik.values.productImages.filter(
      (_, i) => i !== index
    );
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    formik.setFieldValue("productImages", updatedImages);
    setPreviewImages(updatedPreviews);
  };

  return (
    <div className="w-full col-span-1 bg-white rounded-[18px] relative p-5 lg:p-7">
      <h1 className="font-medium text-[20px] leading-none tracking-tight">
        Product Images
      </h1>

      <div className="flex items-center justify-center w-full mt-4">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-[319px] border-2 border-[var(--button-bg)] border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <img
              src="/camera-icon.png"
              alt="camera-icon"
              className="w-[30px] h-[30px]"
            />
            <p className="mb-0.5 mt-2 text-base text-[var(--button-bg)] font-medium">
              Click to upload Image
            </p>
            <p className="text-sm font-medium text-[#959393]">Or Drag & Drop</p>
            <p className="text-xs text-gray-500 mt-1">
              (Max 5 images, PNG/JPG/JPEG)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            multiple
            accept=".png,.jpg,.jpeg"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {previewImages.length > 0 && (
        <div className="w-full grid grid-cols-5 gap-1 mt-4">
          {previewImages.map((src, index) => (
            <div
              key={index}
              className="relative w-[60px] h-[60px] rounded-lg overflow-hidden flex items-center justify-center"
            >
              <img
                src={src}
                alt={`product-${index}`}
                className="w-[53px] h-[53px] object-cover rounded-xl"
              />
              <button
                type="button"
                disabled={loading}
                onClick={() => handleRemoveImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center disabled:cursor-not-allowed"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {formik.touched.productImages && formik.errors.productImages && (
        <p className="text-red-500 text-xs mt-2">
          {formik.errors.productImages}
        </p>
      )}
    </div>
  );
};

export default AddProductImagesUploader;
