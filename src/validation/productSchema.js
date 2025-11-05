import * as Yup from "yup";

export const productSchema = Yup.object().shape({
  productName: Yup.string()
    .trim("Product name cannot start or end with spaces")
    .min(3, "Product name must contain at least 3 characters")
    .max(30, "Product name must be 30 characters or less")
    .required("Product name is required"),

  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be greater than 0")
    .min(1, "Product price can not be less than 1")
    .max(999999, "Product price must be less than 999999")
    .test(
      "max-decimals",
      "Price can have up to 2 decimal places only",
      (value) =>
        value === undefined || /^\d+(\.\d{1,2})?$/.test(value.toString())
    )
    .required("Price is required"),
  category: Yup.string().required("Please select a category"),
  description: Yup.string()
    .trim("Description cannot start or end with spaces")
    .min(10, "Description must be 10 characters or more")
    .max(500, "Description must be 500 characters or less")
    .required("Product description is required"),

  deliveryType: Yup.array()
    .min(1, "Please select at least one delivery type")
    .required("Please select a delivery type"),

  productImages: Yup.array()
    .min(1, "Please upload at least 1 image")
    .max(5, "You can upload up to 5 images only")
    .required("Product image is required"),

  customPickupAddress: Yup.string()
    .trim("Pickup address cannot start or end with spaces")
    .when("deliveryType", {
      is: (types) => Array.isArray(types) && types.includes("pickup"),
      then: (schema) =>
        schema
          .min(10, "Pickup address must be at least 10 characters long")
          .max(100, "Pickup address cannot exceed 100 characters")
          .required("Pickup address is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
});
