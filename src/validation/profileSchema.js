import * as Yup from "yup";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const profileSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, "First name must contain at least 3 characters")
    .max(10, "First name must be 10 characters or less")
    .matches(/^[A-Za-z ]+$/, "First name must contain only letters and spaces")
    .required("First name is required"),
  lastName: Yup.string()
    .min(3, "Last name must contain at least 3 characters")
    .max(10, "Last name must be 10 characters or less")
    .matches(/^[A-Za-z ]+$/, "Last name must contain only letters and spaces")
    .required("Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .test("is-valid-phone", "Invalid phone number", (value) => {
      if (!value) return false;
      const phone = parsePhoneNumberFromString(value);
      return phone ? phone.isValid() : false;
    }),
  location: Yup.string()
    .min(1, `Address cannot be less than 1 characters`)
    .max(30, `Address can not be more than 30 characters`)
    .required("Please enter your location"),
  zipcode: Yup.string()
    .matches(/^[A-Za-z0-9\- ]{4,10}$/, "Please enter a valid zip code")
    .required("Enter your zip code"),
  city: Yup.string().required("Enter your city"),
  state: Yup.string().required("Enter your state"),
  country: Yup.string().required("Enter your country"),
  profileImage: Yup.mixed().nullable(),
});
