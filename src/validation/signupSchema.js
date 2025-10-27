import * as Yup from "yup";

export const signupSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(3, "First name must contain at least 3 characters")
    .max(10, "First name must be 10 characters or less")
    .matches(/^[A-Za-z ]+$/, "First name must contain only letters and spaces")
    .required("Name is required"),
  lastName: Yup.string()
    .min(3, "Last name must contain at least 3 characters")
    .max(10, "Last name must be 10 characters or less")
    .matches(/^[A-Za-z ]+$/, "Last name must contain only letters and spaces")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .matches(
      /^(?![._-])([a-zA-Z0-9._%+-]{1,64})@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    )
    .matches(
      /^(?!.*[._-]{2,})(?!.*\.\.).*$/,
      "Email cannot contain consecutive special characters"
    )
    .required("Email address is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .max(25, "Password cannot be more than 25 characters")
    .matches(
      /[A-Z]/,
      "Password must contain at least one uppercase & one lowercase letter"
    )
    .matches(/\d/, "Password must contain at least one number")
    .matches(
      /[@$!%*?&^#_.-]/,
      "Password must contain at least one special character"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Confirm password is required"),
  profileImage: Yup.mixed().nullable(),
});
