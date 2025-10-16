import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "../../components/Common/TextField";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { BASE_URL } from "../../data/baseUrl";
import Button from "../../components/Common/Button";
import { useAppContext } from "../../context/AppContext";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { IoClose } from "react-icons/io5";
import Loader from "../../components/Common/Loader";

const EditProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [product, setProduct] = useState(null);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const [pickupAddress, setPickupAddress] = useState("");
  const { user } = useAppContext();

  // ✅ Separate states for existing and new images
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isImageDeleted, setIsImageDeleted] = useState(false);

  // ✅ Fetch product details
  const fetchProductDetails = async () => {
    setFetchingProduct(true);
    try {
      const res = await axios.get(`${BASE_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const productData = res?.data?.data?.product;
      setProduct(productData);

      // ✅ Set existing images first
      const images = productData?.images || [];
      setExistingImages(images);

      // ✅ Then set preview images
      const previews = images.map((img) => ({
        id: img.id,
        url: img.imageUrl,
        isNew: false,
      }));

      setPreviewImages(previews);
    } catch (error) {
      handleApiError(error, navigate);
    } finally {
      setFetchingProduct(false);
    }
  };
  useEffect(() => {
    fetchProductDetails();
  }, []);

  useEffect(() => {
    if (product?.pickupAddress?.address) {
      setPickupAddress(product.pickupAddress.address);
    } else if (user?.address) {
      setPickupAddress(user.address);
    }
  }, [product, user]);

  const handleAddNewImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file); // ✅ append single image file

    try {
      const res = await axios.post(
        `${BASE_URL}/products/${product?.id}/images`,
        formData, // ✅ send as FormData (not wrapped)
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res?.data?.success) {
        enqueueSnackbar("Image uploaded successfully!", {
          variant: "success",
        });

        // ✅ Append new uploaded image to existing list (from backend response)
        const uploadedImage = res?.data?.data?.image; // assuming backend returns uploaded image info

        if (uploadedImage) {
          setExistingImages((prev) => [...prev, uploadedImage]);
          setPreviewImages((prev) => [
            ...prev,
            { id: uploadedImage.id, url: uploadedImage.imageUrl, isNew: false },
          ]);
        }
      }
    } catch (error) {
      console.error("Image upload error >>>", error);
      enqueueSnackbar(
        error.response?.data?.message || "Failed to upload image",
        { variant: "error" }
      );
      handleApiError(error, navigate);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      productName: product?.title || "",
      price: product?.price || "",
      description: product?.description || "",
      deliveryType: product
        ? product.deliveryMethod === "both"
          ? ["pickup", "delivery"]
          : [product.deliveryMethod]
        : [],

      pickupAddress: product?.pickupAddress?.address || user?.address || "",
      city: product?.pickupAddress?.city || "",
      state: product?.pickupAddress?.state || "",
    },

    validationSchema: Yup.object({
      productName: Yup.string()
        .min(3, "Product name must contain at least 3 characters")
        .max(50, "Product name must be 50 characters or less")
        .required("Product name is required"),
      price: Yup.number()
        .typeError("Price must be a number")
        .positive("Price must be greater than 0")
        .min(1, "Product price can not be less than 1")
        .max(999999, "Product price must be less than 999999")
        .required("Price is required"),
      description: Yup.string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must be 500 characters or less")
        .required("Product description is required"),
      deliveryType: Yup.array()
        .min(1, "Please select at least one delivery type")
        .required("Please select a delivery type"),
    }),

    onSubmit: async (values) => {
      try {
        setLoading(true);

        const deliveryTypes = Array.isArray(values.deliveryType)
          ? values.deliveryType
          : values.deliveryType.split(",");
        const deliveryMethod =
          deliveryTypes.length === 2 ? "both" : deliveryTypes[0];

        const res = await axios.put(
          `${BASE_URL}/products/${productId}`,
          {
            title: values.productName,
            price: values.price,
            description: values.description,
            deliveryMethod,
            pickupAddress: formik.values.deliveryType.includes("pickup")
              ? pickupAddress
              : null,
          },
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );

        if (res?.data?.success) {
          // ✅ Upload new images only after successful product update
          if (newImages.length > 0) {
            for (const file of newImages) {
              const formData = new FormData();
              formData.append("productImages", file);

              await axios.post(
                `${BASE_URL}/products/${productId}/images`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${getToken()}`,
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
            }
          }

          enqueueSnackbar("Product updated successfully!", {
            variant: "success",
          });
          navigate(
            `/products/${res?.data?.data?.product?.title}?productId=${res?.data?.data?.product?.id}`
          );
        }
      } catch (error) {
        console.error("Update product error:", error.response?.data);
        enqueueSnackbar(error.response?.data?.message || error.message, {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  // ✅ Delivery type toggle
  const handleDeliveryTypeChange = (type) => {
    const { deliveryType } = formik.values;
    if (deliveryType.includes(type)) {
      formik.setFieldValue(
        "deliveryType",
        deliveryType.filter((t) => t !== type)
      );
    } else {
      formik.setFieldValue("deliveryType", [...deliveryType, type]);
    }
  };

  // ✅ Handle image upload (validation + preview)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Allowed formats and size
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter((file) => {
      const fileExt = file.name.split(".").pop().toLowerCase();
      const isValidType = allowedTypes.includes(file.type);
      const isValidExt = ["png", "jpg", "jpeg"].includes(fileExt);
      const isValidSize = file.size <= maxSize;

      if (!isValidType || !isValidExt) {
        enqueueSnackbar(`${file.name} must be a PNG, JPG, or JPEG image`, {
          variant: "warning",
        });
      }
      if (!isValidSize) {
        enqueueSnackbar(`${file.name} exceeds 5MB size limit`, {
          variant: "warning",
        });
      }

      return isValidType && isValidExt && isValidSize;
    });

    const totalCount =
      existingImages.length + newImages.length + validFiles.length;
    if (totalCount > 5) {
      enqueueSnackbar("You can upload a maximum of 5 images total", {
        variant: "warning",
      });
      return;
    }

    // ✅ Just preview locally (do NOT upload yet)
    const localPreviews = validFiles.map((file) => ({
      id: null,
      url: URL.createObjectURL(file),
      isNew: true,
    }));

    setPreviewImages((prev) => [...prev, ...localPreviews]);
    setNewImages((prev) => [...prev, ...validFiles]);
  };

  const handleRemoveImage = async (index) => {
    const totalImages = existingImages.length + newImages.length;

    if (totalImages <= 1) {
      enqueueSnackbar("You must have at least one image", {
        variant: "warning",
      });
      return;
    }

    const image = previewImages[index];

    if (!image) return;

    if (image.isNew) {
      // 🧹 Remove new (not uploaded yet)
      const updatedNew = newImages.filter(
        (_, i) => URL.createObjectURL(newImages[i]) !== image.url
      );
      setNewImages(updatedNew);
    } else if (image.id) {
      // 🧹 Delete existing from backend
      await handleDeleteProductImage(image.id);
      const updatedExisting = existingImages.filter(
        (img) => img.id !== image.id
      );
      setExistingImages(updatedExisting);
    }

    // ✅ Rebuild preview list after removal
    const updatedPreviews = [
      ...existingImages
        .filter((img) => !image.id || img.id !== image.id)
        .map((img) => ({
          id: img.id,
          url: img.imageUrl,
          isNew: false,
        })),
      ...newImages.map((file) => ({
        id: null,
        url: URL.createObjectURL(file),
        isNew: true,
      })),
    ];

    setPreviewImages(updatedPreviews);
  };

  // ✅ Delete product image (API call)
  const handleDeleteProductImage = async (imageId) => {
    console.log(imageId);
    if (!imageId) {
      enqueueSnackbar("Invalid image selected for deletion", {
        variant: "error",
      });
      return;
    }

    setIsImageDeleted(true);
    try {
      const res = await axios.delete(
        `${BASE_URL}/products/${product?.id}/images/${imageId}`,
        {
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );

      if (res?.data?.success) {
        enqueueSnackbar("Image deleted successfully", { variant: "success" });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      handleApiError(error, navigate);
    } finally {
      setIsImageDeleted(false);
    }
  };

  if (isImageDeleted) {
    <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center px-4">
      <Loader />
    </div>;

    return;
  }

  return (
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-20">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="w-full max-w-[48px] flex items-center justify-between text-sm text-white"
      >
        <HiArrowLeft />
        Back
      </button>

      <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-2">
        {fetchingProduct ? (
          <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-2">
            <div className="w-full bg-white rounded-[18px] relative p-5 flex justify-center min-h-[60vh] pt-32">
              <Loader />
            </div>
          </div>
        ) : (
          <form
            onSubmit={formik.handleSubmit}
            className="w-full grid grid-cols-3 gap-4"
          >
            {/* LEFT SECTION */}
            <div className="col-span-2 bg-white rounded-[18px] p-5 lg:p-7">
              <h1 className="font-semibold text-[20px]">Edit Product</h1>
              <div className="border my-5" />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TextField
                  type="text"
                  name="productName"
                  placeholder="Enter product name"
                  value={formik.values.productName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.productName}
                  touched={formik.touched.productName}
                  label={"Product Name"}
                />

                <TextField
                  type="number"
                  name="price"
                  placeholder="Enter product price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.errors.price}
                  touched={formik.touched.price}
                  label={"Price"}
                />
              </div>

              {/* Delivery Type */}
              <div className="mt-4">
                <label className="font-medium text-sm mb-2 block">
                  Delivery Type
                </label>
                <div className="grid grid-cols-2 gap-3 max-w-[388px]">
                  {["pickup", "delivery"].map((type) => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => handleDeliveryTypeChange(type)}
                      className={`py-3 px-4 border rounded-[8px] text-sm font-medium transition-all h-[49px] ${
                        formik.values.deliveryType.includes(type)
                          ? "bg-[var(--button-bg)] text-white"
                          : "bg-[var(--secondary-bg)] text-gray-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                {formik.touched.deliveryType && formik.errors.deliveryType && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.deliveryType}
                  </p>
                )}
              </div>

              {/* Pickup Address (only show if "pickup" is selected) */}
              {formik.values.deliveryType.includes("pickup") && (
                <div className="mt-4">
                  <label className="font-medium text-sm mb-2 block">
                    Pickup Address
                  </label>
                  <input
                    type="text"
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Enter pickup address"
                    className="w-full border h-[49px] bg-[var(--secondary-bg)] px-[15px] py-[14px] rounded-[8px] outline-none"
                  />
                </div>
              )}

              {/* Description */}
              <div className="mt-4">
                <label className="font-medium text-sm mb-2 block">
                  Product Description
                </label>
                <textarea
                  name="description"
                  placeholder="Enter product description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full border h-[159px] bg-[var(--secondary-bg)] px-[15px] py-[14px] rounded-[8px] outline-none resize-none ${
                    formik.touched.description && formik.errors.description
                      ? "border-red-500"
                      : "border-[var(--secondary-bg)]"
                  }`}
                ></textarea>
                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.description}
                  </p>
                )}
              </div>

              <div className="w-full max-w-[196px] mt-6">
                <Button type="submit" title="Save" isLoading={loading} />
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="bg-white rounded-[18px] p-5 lg:p-7">
              <h1 className="font-semibold text-[20px]">Product Images</h1>

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
                    <p className="mt-2 text-base text-[var(--button-bg)] font-semibold">
                      Click to upload Image
                    </p>
                    <p className="text-sm font-medium text-[#959393]">
                      Or Drag & Drop
                    </p>
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

              {/* ✅ Image Preview Grid */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-5 gap-2 mt-5">
                  {previewImages.map((src, index) => (
                    <div
                      className="w-[57px] h-[57px] flex items-center justify-center relative"
                      key={index}
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="w-[14px] h-[14px] bg-[#DA1313] rounded flex items-center justify-center absolute top-0 right-0 z-10"
                      >
                        <IoClose className="text-white" />
                      </button>
                      <img
                        src={src.url}
                        alt={`preview-${index}`}
                        className="w-[53px] h-[53px] object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProductPage;
