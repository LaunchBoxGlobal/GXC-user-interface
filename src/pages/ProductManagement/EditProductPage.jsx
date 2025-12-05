import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "../../components/Common/TextField";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { BASE_URL } from "../../data/baseUrl";
import { useAppContext } from "../../context/AppContext";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { IoClose } from "react-icons/io5";
import Loader from "../../components/Common/Loader";
import { useUser } from "../../context/userContext";
import { editProductSchema } from "../../validation/editProductSchema";
import EditProductSelectCategory from "./EditProductSelectCategory";
import EditProductDeliveryTypeSelector from "./EditProductDeliveryTypeSelector";

const EditProductPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(false);
  const [product, setProduct] = useState(null);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const [pickupAddress, setPickupAddress] = useState("");
  const { user } = useAppContext();
  const { checkIamAlreadyMember } = useUser();
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [isImageDeleted, setIsImageDeleted] = useState(false);
  const [categories, setCategories] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [productCategory, setProductCategory] = useState(null);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      setCategories(res?.data?.data?.categories);
    } catch (error) {
      handleApiError(error, navigate);
    }
  };

  const fetchProductDetails = async () => {
    setFetchingProduct(true);
    try {
      const res = await axios.get(`${BASE_URL}/products/${productId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const productData = res?.data?.data?.product;
      setProduct(productData);
      setProductCategory(productData?.category);

      const images = productData?.images || [];
      setExistingImages(images);

      const previews = images.map((img) => ({
        id: img?.id,
        url: img?.imageUrl,
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
    checkIamAlreadyMember();
    fetchProductDetails();
    fetchCategories();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      productName: product?.title || "",
      price: product?.price || "",
      description: product?.description || "",
      pickupAddress: product?.pickupAddress?.address || user?.address || "",
      city: product?.pickupAddress?.city || "",
      state: product?.pickupAddress?.state || "",
      productImages: product?.images || [],
      category: product?.categories?.length
        ? product.categories.map((c) => {
            const parsed = JSON.parse(c);
            return String(parsed.id);
          })
        : product?.category?.id
        ? [String(product.category.id)]
        : [],
      deliveryType:
        product?.deliveryMethod === "both"
          ? ["self", "community"]
          : product?.deliveryMethod === "pickup"
          ? ["self"]
          : product?.deliveryMethod === "delivery"
          ? ["community"]
          : [],
      selfPickupAddress: product?.pickupAddress?.address || user?.address || "",
      communityPickupAddress: product?.communityPickupAddress?.address || "",
    },

    validationSchema: editProductSchema,

    onSubmit: async (values) => {
      try {
        if (values.productImages.length < 1) {
          enqueueSnackbar("Please upload at least one product image", {
            variant: "warning",
          });
          setLoading(false);
          return;
        }

        checkIamAlreadyMember();
        setLoading(true);

        let deliveryMethod = "pickup";

        if (
          values.deliveryType.includes("self") &&
          values.deliveryType.includes("community")
        ) {
          deliveryMethod = "both";
        } else if (values.deliveryType.includes("community")) {
          deliveryMethod = "delivery";
        } else {
          deliveryMethod = "pickup";
        }

        const res = await axios.put(
          `${BASE_URL}/products/${productId}`,
          {
            title: values.productName.trim(),
            price: values.price,
            description: values.description.trim(),
            categories: values.category,

            pickupAddress: values.selfPickupAddress.trim(),

            deliveryMethod: deliveryMethod,
            selfPickupAddress: values.selfPickupAddress || null,
            communityPickupAddress: values.communityPickupAddress || null,
          },
          {
            headers: { Authorization: `Bearer ${getToken()}` },
          }
        );

        if (res?.data?.success) {
          enqueueSnackbar("Product updated successfully!", {
            variant: "success",
          });

          navigate(
            `/products/${res.data.data.product.title}?productId=${res.data.data.product.id}`
          );
        }
      } catch (error) {
        enqueueSnackbar(error.response?.data?.message || error.message, {
          variant: "error",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.pickupAddress !== pickupAddress) {
      formik.setFieldValue("pickupAddress", pickupAddress);
    }
  }, [pickupAddress]);

  useEffect(() => {
    if (product?.pickupAddress?.address) {
      setPickupAddress(product.pickupAddress.address);
    } else if (user?.address) {
      setPickupAddress(user.address);
    }
  }, [product, user]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/png", "image/jpg", "image/jpeg"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = files.filter((file) => {
      const ext = file.name.split(".").pop().toLowerCase();
      const validType = allowedTypes.includes(file.type);
      const validExt = ["png", "jpg", "jpeg"].includes(ext);
      const validSize = file.size <= maxSize;

      if (!validType || !validExt) {
        enqueueSnackbar(`${file.name} must be PNG, JPG, or JPEG`, {
          variant: "warning",
        });
      }
      if (!validSize) {
        enqueueSnackbar(`${file.name} exceeds 5MB limit`, {
          variant: "warning",
        });
      }

      return validType && validExt && validSize;
    });

    const total = existingImages.length + newImages.length + validFiles.length;
    if (total > 5) {
      enqueueSnackbar("You can upload a maximum of 5 images total", {
        variant: "error",
      });
      return;
    }

    const newPreviews = validFiles.map((file) => ({
      id: null,
      url: URL.createObjectURL(file),
      isNew: true,
      file,
    }));

    setPreviewImages((prev) => [...prev, ...newPreviews]);
    setNewImages((prev) => [...prev, ...validFiles]);
    formik.setFieldValue("productImages", [
      ...existingImages,
      ...newImages,
      ...validFiles,
    ]);

    for (const file of validFiles) {
      const formData = new FormData();
      formData.append("productImages", file);

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

        const uploaded = res?.data?.data?.image;
        if (uploaded) {
          enqueueSnackbar(`${file.name} uploaded successfully!`, {
            variant: "success",
          });

          setPreviewImages((prev) =>
            prev.map((img) =>
              img.file === file
                ? { id: uploaded.id, url: uploaded.imageUrl, isNew: false }
                : img
            )
          );

          setExistingImages((prev) => [...prev, uploaded]);
          setNewImages((prev) => prev.filter((f) => f !== file));

          formik.setFieldValue("productImages", (prevVal) => [
            ...prevVal.filter((img) => img.id !== uploaded.id),
            uploaded,
          ]);
        }
      } catch (error) {
        enqueueSnackbar(`Failed to upload ${file.name}`, { variant: "error" });
        handleApiError(error, navigate);
      }
    }
  };

  const handleDeleteProductImage = async (imageId) => {
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
        { headers: { Authorization: `Bearer ${getToken()}` } }
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

  const handleRemoveImage = async (index) => {
    if (previewImages.length === 1) {
      enqueueSnackbar(
        "You must have at least one image. Please upload another before deleting this one.",
        { variant: "warning" }
      );
      return;
    }

    const image = previewImages[index];
    if (!image) return;

    let updatedExisting = [...existingImages];
    let updatedNew = [...newImages];

    if (image.isNew) {
      updatedNew = updatedNew.filter((f) => f !== image.file);
      URL.revokeObjectURL(image.url);
    } else if (image.id) {
      try {
        await handleDeleteProductImage(image.id);
        updatedExisting = updatedExisting.filter((img) => img.id !== image.id);
      } catch (error) {
        enqueueSnackbar("Failed to delete image from server.", {
          variant: "error",
        });
        handleApiError(error, navigate);
        return;
      }
    }

    const updatedPreviews = [
      ...updatedExisting.map((img) => ({
        id: img.id,
        url: img.imageUrl,
        isNew: false,
      })),
      ...updatedNew.map((file) => ({
        id: null,
        url: URL.createObjectURL(file),
        isNew: true,
        file,
      })),
    ];

    setExistingImages(updatedExisting);
    setNewImages(updatedNew);
    setPreviewImages(updatedPreviews);
    formik.setFieldValue("productImages", [...updatedExisting, ...updatedNew]);
  };

  if (fetchingProduct || isImageDeleted) {
    return (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center px-4">
        <Loader />
      </div>
    );
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
          <div className="w-full bg-white rounded-[18px] relative p-5 flex justify-center min-h-[60vh] pt-32">
            <Loader />
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
                  label="Product Name"
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
                  label="Price"
                />
              </div>

              <EditProductDeliveryTypeSelector
                product={product}
                formik={formik}
              />

              {/* Pickup Address */}
              {formik.values.deliveryType.includes("self") && (
                <div className="mt-4">
                  <label className="font-medium text-sm mb-1">
                    Self Pickup Address
                  </label>
                  <input
                    type="text"
                    name="selfPickupAddress"
                    value={formik.values.selfPickupAddress}
                    onChange={formik.handleChange}
                    className="w-full h-[49px] border rounded-[8px] bg-[var(--secondary-bg)] px-3"
                  />
                </div>
              )}

              {formik.values.deliveryType.includes("community") && (
                <div className="mt-4">
                  <label className="font-medium text-sm mb-1">
                    Community Pickup Address
                  </label>
                  <input
                    type="text"
                    name="communityPickupAddress"
                    value={formik.values.communityPickupAddress}
                    onChange={formik.handleChange}
                    className="w-full h-[49px] border rounded-[8px] bg-[var(--secondary-bg)] px-3"
                  />
                </div>
              )}

              {/* Category */}
              <EditProductSelectCategory
                formik={formik}
                categories={categories}
                setSelectedCategories={setSelectedCategories}
                productCategory={productCategory}
              />

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
                <button
                  type={"submit"}
                  disabled={loading}
                  className="button relative flex items-center justify-center disabled:cursor-not-allowed"
                >
                  {loading ? <Loader /> : "Save"}
                </button>
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="bg-white rounded-[18px] p-5 lg:p-7">
              <h1 className="font-semibold text-[20px]">Product Images</h1>

              <div className="flex flex-col items-start justify-center w-full mt-4">
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

                {formik.touched.productImages &&
                  formik.errors.productImages && (
                    <p className="text-red-500 text-xs mt-2">
                      {formik.errors.productImages}
                    </p>
                  )}
              </div>

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
                        disabled={previewImages.length === 1}
                        className={`absolute top-0 right-0 rounded w-[14px] h-[14px] flex items-center justify-center z-10 ${
                          previewImages.length === 1
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-[#DA1313] hover:bg-red-700"
                        }`}
                      >
                        <IoClose className="text-white" />
                      </button>
                      <img
                        src={src.url}
                        alt={`preview-${index}`}
                        className="w-[53px] h-[53px] object-cover rounded-xl"
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
