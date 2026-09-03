import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const profileSchema = (t) =>
  Yup.object().shape({
    firstName: Yup.string()
      .min(3, t("profile.validation.firstName.min"))
      .max(10, t("profile.validation.firstName.max"))
      .matches(/^[A-Za-z ]+$/, t("profile.validation.firstName.invalid"))
      .required(t("profile.validation.firstName.required")),

    lastName: Yup.string()
      .min(3, t("profile.validation.lastName.min"))
      .max(10, t("profile.validation.lastName.max"))
      .matches(/^[A-Za-z ]+$/, t("profile.validation.lastName.invalid"))
      .required(t("profile.validation.lastName.required")),

    email: Yup.string()
      .email(t("profile.validation.email.invalid"))
      .required(t("profile.validation.email.required")),

    phoneNumber: Yup.string()
      .required(t("profile.validation.phoneNumber.required"))
      .test(
        "is-valid-phone",
        t("profile.validation.phoneNumber.invalid"),
        (value) => {
          if (!value) return false;
          const phone = parsePhoneNumberFromString(value);
          return phone ? phone.isValid() : false;
        },
      ),

    location: Yup.string()
      .min(1, t("profile.validation.location.min"))
      .max(30, t("profile.validation.location.max"))
      .required(t("profile.validation.location.required")),

    zipcode: Yup.string()
      .matches(
        /^[A-Za-z0-9\- ]{4,10}$/,
        t("profile.validation.zipcode.invalid"),
      )
      .required(t("profile.validation.zipcode.required")),

    city: Yup.string().required(t("profile.validation.city.required")),

    state: Yup.string().required(t("profile.validation.state.required")),

    country: Yup.string().required(t("profile.validation.country.required")),

    profileImage: Yup.mixed().nullable(),
  });
