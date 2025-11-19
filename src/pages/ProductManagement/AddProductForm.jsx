import { useState, useEffect } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import Button from "../../components/Common/Button";
import TextField from "../../components/Common/TextField";
import { productSchema } from "../../validation/productSchema";
import AddProductDeliveryTypeSelector from "./AddProductDeliveryTypeSelector";
import AddProductImagesUploader from "./AddProductImagesUploader";
import AddProductPickupAddressField from "./AddProductPickupAddressField";
import AddProductSelectCategory from "./AddProductSelectCategory";
import { useUser } from "../../context/userContext";
import { RxCross2 } from "react-icons/rx";

const AddProductForm = ({ categories, user, selectedCommunity }) => {
  const { checkIamAlreadyMember } = useUser();
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [revenueConfig, setRevenueConfig] = useState(null);

  // const userAddress = `${user?.address || ""} + ${user?.city || ""} ${
  //   user?.state || ""
  // } ${user?.zipcode || ""} ${user?.country || ""}`.trim();

  const userAddress = [
    user?.address,
    user?.city,
    user?.state,
    user?.zipcode,
    user?.country,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const fetchRevenueSplitConfig = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/get-revenue-config`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      // console.log("fetchRevenueSplitConfig >>> ", res?.data);
      setRevenueConfig(res?.data?.data);
    } catch (error) {
      console.log("fetchRevenueSplitConfig error >>> ", error);
    }
  };

  useEffect(() => {
    fetchRevenueSplitConfig();
  }, []);

  const formik = useFormik({
    initialValues: {
      productName: "",
      price: "",
      description: "",
      deliveryType: [],
      productImages: [],
      customPickupAddress: "",
      category: [],
    },
    validationSchema: productSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!selectedCommunity?.id) {
          enqueueSnackbar(
            "Please select a community before adding a product.",
            {
              variant: "warning",
            }
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
        // formData.append("categoryId", values.category);
        // formData.append("categoryId", JSON.stringify(values.category));
        formData.append("categoryId", values.category[0]);
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
            window.location.href = `/products/${product.title}?productId=${product.id}`;
          } else {
            window.location.href = "/product-management";
          }
        }
      } catch (error) {
        console.log("error >> ", error);
        if (error?.response?.data?.message === "Validation failed") {
          enqueueSnackbar("Something went wrong. Please Try again.", {
            variant: "error",
          });

          return;
        }
        enqueueSnackbar(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong while adding a product!",
          { variant: "error" }
        );
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const selected = categories.filter((c) =>
      formik.values.category.includes(c.id)
    );
    setSelectedCategories(selected);
  }, [formik.values.category, categories]);

  const removeCategory = (id) => {
    const updated = formik.values.category.filter((cat) => cat !== id);
    formik.setFieldValue("category", updated);
  };

  useEffect(() => {
    if (
      formik.values.deliveryType.includes("pickup") &&
      !formik.values.customPickupAddress &&
      userAddress
    ) {
      formik.setFieldValue("customPickupAddress", userAddress);
    }
  }, [formik.values.deliveryType, userAddress]);

  const price = parseFloat(formik.values.price) || 0;
  const estimatedEarnings = (
    price *
    (revenueConfig?.seller_percentage / 100)
  ).toFixed(2);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full grid grid-cols-3 gap-4"
    >
      {/* LEFT SECTION */}
      <div className="w-full pt-3 col-span-2 bg-white rounded-[18px] p-5 lg:p-7">
        <h1 className="font-semibold text-[20px] leading-none tracking-tight">
          Add New Product
        </h1>
        <div className="w-full border my-5" />

        <div className="w-full flex flex-col gap-4">
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
            <div className="w-full">
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
              <p className="text-sm text-gray-500 mt-1">
                Your estimated earnings:{" "}
                <span className="text-black font-medium">
                  ${estimatedEarnings}
                </span>
              </p>
            </div>
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AddProductDeliveryTypeSelector formik={formik} />
            <AddProductSelectCategory
              formik={formik}
              categories={categories}
              setSelectedCategories={setSelectedCategories}
            />
          </div>

          {selectedCategories && selectedCategories?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedCategories?.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-1.5 bg-gray-200 px-3 py-1 rounded-full text-sm font-medium"
                >
                  {cat.name}

                  <button
                    type="button"
                    onClick={() => removeCategory(cat.id)}
                    className="text-gray-700 hover:text-black"
                  >
                    <RxCross2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Pickup Address */}
          {formik.values.deliveryType.includes("pickup") && (
            <AddProductPickupAddressField formik={formik} />
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
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {formik.errors.description}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="w-full max-w-[196px]">
            <Button type="submit" title="Add Product" isLoading={loading} />
          </div>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <AddProductImagesUploader
        formik={formik}
        previewImages={previewImages}
        setPreviewImages={setPreviewImages}
        loading={loading}
      />
    </form>
  );
};

export default AddProductForm;
