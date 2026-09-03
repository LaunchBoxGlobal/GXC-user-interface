import * as Yup from "yup";

export const productSchema = (t) =>
  Yup.object().shape({
    productName: Yup.string()
      .trim(t("validation.productName.trim"))
      .min(3, t("validation.productName.min"))
      .max(30, t("validation.productName.max"))
      .required(t("validation.productName.required")),

    price: Yup.number()
      .typeError(t("validation.price.type"))
      .positive(t("validation.price.positive"))
      .min(1, t("validation.price.min"))
      .max(999999, t("validation.price.max"))
      .test(
        "max-decimals",
        t("validation.price.decimals"),
        (value) =>
          value === undefined || /^\d+(\.\d{1,2})?$/.test(value.toString()),
      )
      .required(t("validation.price.required")),

    category: Yup.array()
      .min(1, t("validation.category.min"))
      .max(5, t("validation.category.max"))
      .required(t("validation.category.required")),

    description: Yup.string()
      .trim(t("validation.description.trim"))
      .min(10, t("validation.description.min"))
      .max(500, t("validation.description.max"))
      .required(t("validation.description.required")),

    deliveryType: Yup.array()
      .min(1, t("validation.deliveryType.min"))
      .required(t("validation.deliveryType.required")),

    productImages: Yup.array()
      .min(1, t("validation.productImages.min"))
      .max(5, t("validation.productImages.max"))
      .required(t("validation.productImages.required")),

    customPickupAddress: Yup.string()
      .trim(t("validation.pickupAddress.trim"))
      .when("deliveryType", {
        is: (types) => Array.isArray(types) && types.includes("pickup"),
        then: (schema) =>
          schema
            .min(10, t("validation.pickupAddress.min"))
            .max(100, t("validation.pickupAddress.max"))
            .required(t("validation.pickupAddress.required")),
        otherwise: (schema) => schema.notRequired(),
      }),
  });
