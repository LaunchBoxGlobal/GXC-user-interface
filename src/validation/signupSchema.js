import * as Yup from "yup";

export const signupSchema = (t) =>
  Yup.object().shape({
    firstName: Yup.string()
      .min(3, t("signup.validation.firstName.min"))
      .max(10, t("signup.validation.firstName.max"))
      .matches(/^[A-Za-z ]+$/, t("signup.validation.firstName.invalid"))
      .required(t("signup.validation.firstName.required")),

    lastName: Yup.string()
      .min(3, t("signup.validation.lastName.min"))
      .max(10, t("signup.validation.lastName.max"))
      .matches(/^[A-Za-z ]+$/, t("signup.validation.lastName.invalid"))
      .required(t("signup.validation.lastName.required")),

    email: Yup.string()
      .email(t("signup.validation.email.invalid"))
      .matches(
        /^(?![._-])([a-zA-Z0-9._%+-]{1,64})@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
        t("signup.validation.email.format"),
      )
      .matches(
        /^(?!.*[._-]{2,})(?!.*\.\.).*$/,
        t("signup.validation.email.noConsecutive"),
      )
      .required(t("signup.validation.email.required")),

    password: Yup.string()
      .min(8, t("signup.validation.password.min"))
      .max(25, t("signup.validation.password.max"))
      .matches(/[A-Z]/, t("signup.validation.password.uppercase"))
      .matches(/\d/, t("signup.validation.password.number"))
      .matches(/[@$!%*?&^#_.-]/, t("signup.validation.password.special"))
      .required(t("signup.validation.password.required")),

    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        t("signup.validation.confirmPassword.match"),
      )
      .required(t("signup.validation.confirmPassword.required")),

    profileImage: Yup.mixed().nullable(),
  });
