import * as Yup from "yup";

export const changePasswordSchema = (t) =>
  Yup.object({
    currentPassword: Yup.string().required(
      t(`settings.changePassword.form.errors.currentPassRequired`),
    ),
    password: Yup.string()
      .min(8, t(`settings.changePassword.form.errors.passMin`))
      .max(25, t(`settings.changePassword.form.errors.passMax`))
      .matches(/[A-Z]/, t(`settings.changePassword.form.errors.passUppercase`))
      .matches(/[a-z]/, t(`settings.changePassword.form.errors.passLowercase`))
      .matches(/\d/, t(`settings.changePassword.form.errors.passNum`))
      .matches(
        /[@$!%*?&^#_.-]/,
        t(`settings.changePassword.form.errors.passMatch`),
      )
      .required(t(`settings.changePassword.form.errors.passRequired`)),
    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password"), null],
        t(`settings.changePassword.form.errors.confirmPass`),
      )
      .required(t(`settings.changePassword.form.errors.confirmPassRequired`)),
  });
