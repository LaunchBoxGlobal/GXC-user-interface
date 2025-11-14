import { useEffect, useState } from "react";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import Loader from "../../components/Common/Loader";

const EditProductImagesUploader = ({ product, productId }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const MAX_IMAGES = 5;

  useEffect(() => {
    if (product?.images?.length) {
      setImages(product.images);
    }
  }, [product]);

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    e.target.value = "";

    if (images.length >= MAX_IMAGES) {
      enqueueSnackbar(
        `You can only have up to ${MAX_IMAGES} images in total.`,
        {
          variant: "warning",
        }
      );
      return;
    }

    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    const maxSize = 5 * 1024 * 1024;

    const validFiles = files.filter((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      const validType = allowedTypes.includes(file.type);
      const validExt = ["png", "jpg", "jpeg"].includes(ext);
      const validSize = file.size <= maxSize;

      if (!validExt)
        enqueueSnackbar("Invalid extensions (PNG/JPG/JPEG only)", {
          variant: "warning",
        });
      if (!validType)
        enqueueSnackbar("Unsupported file type", { variant: "warning" });
      if (!validSize)
        enqueueSnackbar("File exceeds 5MB size limit", { variant: "warning" });

      return validType && validExt && validSize;
    });

    if (validFiles.length === 0) return;

    const remainingSlots = MAX_IMAGES - images.length;
    const filesToUpload = validFiles.slice(0, remainingSlots);

    if (filesToUpload.length < validFiles.length) {
      enqueueSnackbar(`You can only upload ${remainingSlots} more image(s).`, {
        variant: "warning",
      });
    }

    await uploadImages(filesToUpload);
  };

  const uploadImages = async (files) => {
    setUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

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
        const uploaded = res?.data?.data?.images || [];
        setImages((prev) => [...prev, ...uploaded].slice(0, MAX_IMAGES));
        enqueueSnackbar("Images uploaded successfully!", {
          variant: "success",
        });
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (images.length === 1) {
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
              (Max {MAX_IMAGES} images, PNG/JPG/JPEG)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            multiple
            accept=".png,.jpg,.jpeg"
            onChange={handleImageChange}
            className="hidden"
            disabled={uploading || images.length >= MAX_IMAGES}
          />
        </label>
      </div>

      {/* All Images in One Row */}
      <div className="w-full flex flex-wrap items-center gap-2 mt-4">
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
              disabled={deleting === img.id || images.length === 1}
              onClick={() => handleDeleteImage(img.id)}
              className={`absolute top-0 right-0 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center disabled:cursor-not-allowed ${
                images.length === 1 ? "bg-gray-400" : "bg-red-500"
              }`}
            >
              {deleting === img.id ? <Loader size={14} color="white" /> : "✕"}
            </button>
          </div>
        ))}
      </div>

      {uploading && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <Loader size={18} /> Uploading images...
        </div>
      )}
    </div>
  );
};

export default EditProductImagesUploader;
