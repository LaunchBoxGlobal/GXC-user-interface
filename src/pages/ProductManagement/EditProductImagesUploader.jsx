import { useEffect, useState } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import Loader from "../../components/Common/Loader";

const MAX_IMAGES = 5;

const EditProductImagesUploader = ({ product, productId }) => {
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (product?.images?.length) {
      setImages(product.images);
    }
  }, [product]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    const maxSize = 5 * 1024 * 1024; // 5 MB

    let shownInvalid = false;

    const validFiles = files.filter((file) => {
      const isValidType = allowedTypes.includes(file.type);
      const isValidSize = file.size <= maxSize;

      if (!isValidType && !shownInvalid) {
        enqueueSnackbar("Invalid file type. Use PNG, JPG, or JPEG.", {
          variant: "warning",
        });
        shownInvalid = true;
      }

      if (!isValidSize && !shownInvalid) {
        enqueueSnackbar("File size exceeds 5MB limit.", { variant: "warning" });
        shownInvalid = true;
      }

      return isValidType && isValidSize;
    });

    e.target.value = "";

    // ✅ Calculate total count (existing + new)
    const totalImagesCount =
      images.length + newImages.length + validFiles.length;
    if (totalImagesCount > MAX_IMAGES) {
      enqueueSnackbar(`You can upload a maximum of ${MAX_IMAGES} images.`, {
        variant: "error",
      });

      // Allow only up to remaining slots
      const remainingSlots = MAX_IMAGES - images.length - newImages.length;
      if (remainingSlots <= 0) return;
      validFiles.splice(remainingSlots);
    }

    const updatedNewImages = [...newImages, ...validFiles];
    setNewImages(updatedNewImages);
    setPreviewImages(updatedNewImages.map((f) => URL.createObjectURL(f)));
  };

  const handleRemoveNewImage = (index) => {
    const updatedFiles = newImages.filter((_, i) => i !== index);
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setNewImages(updatedFiles);
    setPreviewImages(updatedPreviews);
  };

  const handleDeleteExistingImage = async (imageId) => {
    // Prevent deleting last image if no new image exists
    if (images.length === 1 && newImages.length === 0) {
      enqueueSnackbar("At least one image is required.", {
        variant: "warning",
      });
      return;
    }

    setDeleting(imageId);
    try {
      const res = await axios.delete(
        `${BASE_URL}/products/${productId}/images/${imageId}`,
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );
      if (res?.data?.success) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
        enqueueSnackbar("Image deleted successfully!", { variant: "success" });
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setDeleting(null);
    }
  };

  const handleUploadImages = async () => {
    if (newImages.length === 0) {
      enqueueSnackbar("Please select at least one image to upload.", {
        variant: "warning",
      });
      return;
    }

    setUploading(true);
    const formData = new FormData();
    newImages.forEach((file) => formData.append("images", file));

    try {
      const res = await axios.post(
        `${BASE_URL}/products/${productId}/images`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res?.data?.success) {
        enqueueSnackbar("Images uploaded successfully!", {
          variant: "success",
        });
        setImages(res?.data?.data?.images || []);
        setNewImages([]);
        setPreviewImages([]);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-[18px] p-5 lg:p-7 h-fit">
      <h1 className="font-medium text-[20px] leading-none tracking-tight">
        Product Images
      </h1>

      {/* Upload Area */}
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
            onChange={handleImageChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Combined Image Row */}
      <div className="w-full flex flex-wrap gap-2 mt-4">
        {/* Existing Images */}
        {images.map((img) => (
          <div
            key={img.id}
            className="relative w-[60px] h-[60px] rounded-lg overflow-hidden flex items-center justify-center"
          >
            <img
              src={img.imageUrl}
              alt="product"
              className="w-[53px] h-[53px] object-cover rounded-xl"
            />
            <button
              type="button"
              disabled={
                deleting === img.id ||
                (images.length === 1 && newImages.length === 0)
              }
              onClick={() => handleDeleteExistingImage(img.id)}
              className={`absolute top-0 right-0 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center disabled:cursor-not-allowed ${
                images.length === 1 && newImages.length === 0
                  ? "bg-gray-400"
                  : "bg-red-500"
              }`}
            >
              {deleting === img.id ? <Loader size={14} color="white" /> : "✕"}
            </button>
          </div>
        ))}

        {/* New Images */}
        {previewImages.map((src, index) => (
          <div
            key={index}
            className="relative w-[60px] h-[60px] rounded-lg overflow-hidden flex items-center justify-center"
          >
            <img
              src={src}
              alt={`preview-${index}`}
              className="w-[53px] h-[53px] object-cover rounded-xl"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => handleRemoveNewImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center disabled:cursor-not-allowed"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditProductImagesUploader;
