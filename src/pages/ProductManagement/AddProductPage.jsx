import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "../../components/Common/TextField";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { BASE_URL } from "../../data/baseUrl";
import Button from "../../components/Common/Button";
import { useAppContext } from "../../context/AppContext";
import { getToken } from "../../utils/getToken";
import { useUser } from "../../context/userContext";
import { productSchema } from "../../validation/productSchema";
import { handleApiError } from "../../utils/handleApiError";

const AddProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const { user } = useAppContext();
  const { selectedCommunity, checkIamAlreadyMember } = useUser();
  const [customPickupAddress, setCustomPickupAddress] = useState("");
  const [categories, setCategories] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      console.log("categories >>> ", res?.data?.data?.categories);
      setCategories(res?.data?.data?.categories);
    } catch (error) {
      handleApiError(error, navigate);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const userAddress =
    user?.address +
    " " +
    user?.city +
    " " +
    user?.state +
    " " +
    user?.zipcode +
    " " +
    user?.country;

  const formik = useFormik({
    initialValues: {
      productName: "",
      price: "",
      description: "",
      deliveryType: [],
      productImages: [],
      customPickupAddress: "",
      category: "",
    },
    validationSchema: productSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!selectedCommunity?.id) {
          enqueueSnackbar(
            "Please select a community before adding a product.",
            { variant: "warning" }
          );
          return;
        }
        setLoading(true);
        checkIamAlreadyMember();

        const formData = new FormData();
        const deliveryTypes = Array.isArray(values.deliveryType)
          ? values.deliveryType
          : values.deliveryType.split(",");

        const deliveryMethod =
          deliveryTypes.length === 2 ? "both" : deliveryTypes[0];
        formData.append("title", values.productName.trim());
        formData.append("price", values.price);
        formData.append("description", values.description.trim());
        formData.append("categoryId", values.category);

        formData.append("deliveryMethod", deliveryMethod);
        values.productImages.forEach((file) =>
          formData.append("productImages", file)
        );
        if (values.deliveryType.includes("pickup")) {
          formData.append(
            "pickupAddress",
            values.customPickupAddress.trim() || user?.address.trim() || ""
          );
          formData.append("pickupCity", user?.city.trim() || "");
          formData.append("pickupState", user?.state.trim() || "");
        }

        const res = await axios.post(
          `${BASE_URL}/communities/${selectedCommunity?.id}/products`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (res?.data?.success) {
          enqueueSnackbar(res?.data?.message || "Product added successfully!", {
            variant: "success",
          });
          resetForm();
          setPreviewImages([]);
          const product = res?.data?.data?.product;

          if (product && Object.keys(product).length > 0) {
            navigate(`/products/${product.title}?productId=${product.id}`);
          } else {
            navigate("/product-management");
          }
        }
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong while adding a product!",
          {
            variant: "error",
          }
        );
      } finally {
        setLoading(false);
      }
    },
  });

  // ✅ Handle delivery type toggle
  const handleDeliveryTypeChange = (type) => {
    const { deliveryType } = formik.values;
    if (deliveryType.includes(type)) {
      formik.setFieldValue(
        "deliveryType",
        deliveryType.filter((t) => t !== type)
      );
    } else {
      formik.setFieldValue("deliveryType", [...deliveryType, type]);

      if (type === "pickup") {
        // Check user address info
        if (!user?.address || !user?.city || !user?.state || !user?.zipcode) {
          enqueueSnackbar("Please add your full address first.", {
            variant: "info",
          });
          navigate("/edit-profile");
        }
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    const maxSize = 5 * 1024 * 1024;
    const maxImages = 5;

    // Flags to show each warning only once
    let shownInvalidExt = false;
    let shownInvalidType = false;
    let shownInvalidSize = false;

    const validFiles = files.filter((file) => {
      const fileExt = file.name.split(".").pop().toLowerCase();
      const isValidType = allowedTypes.includes(file.type);
      const isValidExt = ["png", "jpg", "jpeg"].includes(fileExt);
      const isValidSize = file.size <= maxSize;

      if (!isValidExt && !shownInvalidExt) {
        enqueueSnackbar(
          "Some files have invalid extensions (PNG/JPG/JPEG only)",
          {
            variant: "warning",
            autoHideDuration: 2000,
          }
        );
        shownInvalidExt = true;
      }

      if (!isValidType && !shownInvalidType) {
        enqueueSnackbar("Some files are not supported (PNG/JPG/JPEG only)", {
          variant: "warning",
          autoHideDuration: 2000,
        });
        shownInvalidType = true;
      }

      if (!isValidSize && !shownInvalidSize) {
        enqueueSnackbar("Some files exceed the 5MB size limit", {
          variant: "warning",
          autoHideDuration: 2000,
        });
        shownInvalidSize = true;
      }

      return isValidType && isValidExt && isValidSize;
    });

    e.target.value = ""; // ✅ Reset input so same files can be reselected

    // Combine with existing images
    const combinedImages = [...formik.values.productImages, ...validFiles];

    // ✅ If total exceeds 5, show warning once
    if (combinedImages.length > maxImages) {
      enqueueSnackbar(`You can only upload up to ${maxImages} images.`, {
        variant: "error",
        autoHideDuration: 2500,
      });
    }

    // ✅ Slice to max 5
    const newImages = combinedImages.slice(0, maxImages);
    formik.setFieldValue("productImages", newImages);

    // ✅ Update previews
    const previews = newImages.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // ✅ Remove image
  const handleRemoveImage = (index) => {
    const updatedImages = formik.values.productImages.filter(
      (_, i) => i !== index
    );
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    formik.setFieldValue("productImages", updatedImages);
    setPreviewImages(updatedPreviews);
  };

  useEffect(() => {
    // Prefill only if pickup is selected and no custom address entered yet
    if (
      formik.values.deliveryType.includes("pickup") &&
      !formik.values.customPickupAddress &&
      userAddress
    ) {
      formik.setFieldValue("customPickupAddress", userAddress);
    }
  }, [formik.values.deliveryType, userAddress]);

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
        <div className="w-full relative">
          <form
            onSubmit={formik.handleSubmit}
            className="w-full grid grid-cols-3 gap-4"
          >
            {/* LEFT SECTION */}
            <div className="w-full pt-3 col-span-2 bg-white rounded-[18px] relative p-5 lg:p-7">
              <h1 className="font-semibold text-[20px] leading-none tracking-tight">
                Add New Product
              </h1>
              <div className="w-full border my-5" />

              <div className="w-full flex flex-col items-start gap-4">
                {/* Product Name & Price */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="w-full flex flex-col gap-2">
                    <label className="font-medium text-sm">Delivery Type</label>
                    <div className="w-full max-w-[388px] grid grid-cols-2 gap-3">
                      {["pickup", "delivery"].map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => handleDeliveryTypeChange(type)}
                          className={`px-4 border rounded-[8px] text-sm font-medium transition-all h-[49px] ${
                            formik.values.deliveryType.includes(type)
                              ? "bg-[var(--button-bg)] text-white border-[var(--secondary-bg)]"
                              : "bg-[var(--secondary-bg)] text-gray-700 border-[var(--secondary-bg)]"
                          }`}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                      ))}
                    </div>
                    {formik.touched.deliveryType &&
                      formik.errors.deliveryType && (
                        <p className="text-red-500 text-xs">
                          {formik.errors.deliveryType}
                        </p>
                      )}
                  </div>

                  <div className="w-full flex flex-col gap-2">
                    <label htmlFor="category" className="text-sm font-medium">
                      Category
                    </label>
                    <select
                      name="category"
                      id="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full border h-[49px] bg-[var(--secondary-bg)] px-[15px] py-[14px] font-normal text-[#6D6D6D] rounded-[8px] outline-none transition-all ${
                        formik.touched.category && formik.errors.category
                          ? "border-red-500"
                          : "border-[var(--secondary-bg)]"
                      }`}
                    >
                      {categories?.map((c) => (
                        <option value={c?.id} key={c?.id}>
                          {c?.name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.category && formik.errors.category && (
                      <p className="text-red-500 text-xs">
                        {formik.errors.category}
                      </p>
                    )}
                  </div>
                </div>
                {/* pickup address */}
                {formik.values.deliveryType.includes("pickup") && (
                  <div className="w-full">
                    <label className="font-medium text-sm mb-2 block">
                      Self Pickup Address
                    </label>

                    {/* Editable pre-filled address field */}
                    <textarea
                      name="customPickupAddress"
                      placeholder="Enter pickup address"
                      value={formik.values.customPickupAddress}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full bg-[var(--secondary-bg)] text-[#6D6D6D] px-[15px] py-[10px] rounded-[8px] outline-none h-[49px] resize-none ${
                        formik.touched.customPickupAddress &&
                        formik.errors.customPickupAddress
                          ? "border border-red-500"
                          : "border border-[var(--secondary-bg)]"
                      }`}
                    />
                    {formik.touched.customPickupAddress &&
                    formik.errors.customPickupAddress ? (
                      <p className="text-red-500 text-xs mt-1">
                        {formik.errors.customPickupAddress}
                      </p>
                    ) : null}
                  </div>
                )}

                {/* Description */}
                <div className="w-full">
                  <label className="font-medium text-sm mb-2 block">
                    Product Description
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    placeholder="Enter product description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full border text-[#6D6D6D] h-[159px] bg-[var(--secondary-bg)] px-[15px] py-[14px] rounded-[8px] outline-none resize-none ${
                      formik.touched.description && formik.errors.description
                        ? "border-red-500"
                        : "border-[var(--secondary-bg)]"
                    }`}
                  ></textarea>
                  {formik.touched.description && formik.errors.description ? (
                    <p className="text-red-500 text-xs mt-1">
                      {formik.errors.description}
                    </p>
                  ) : null}
                </div>

                {/* Submit Button */}
                <div className="w-full max-w-[196px]">
                  <Button
                    type={"submit"}
                    title={"Add Product"}
                    isLoading={loading}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT SECTION - IMAGE UPLOAD */}
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
                    <p className="mb-0.5 mt-2 text-base text-[var(--button-bg)]">
                      <span className="font-medium">Click to upload Image</span>
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

              {/* Image Previews */}
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

              {/* Error message */}
              {formik.touched.productImages && formik.errors.productImages ? (
                <p className="text-red-500 text-xs mt-2">
                  {formik.errors.productImages}
                </p>
              ) : null}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
