import { useFormik } from "formik";
import PasswordField from "../../components/Common/PasswordField";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import * as Yup from "yup";
import { getToken } from "../../utils/getToken";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { useUser } from "../../context/userContext";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

const ChangePasswordPage = () => {
  const navigate = useNavigate();
  const { checkIamAlreadyMember } = useUser();
  const { t } = useTranslation("settings");

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string().required(
        t(`settings.changePassword.form.errors.currentPassRequired`),
      ),
      password: Yup.string()
        .min(8, t(`settings.changePassword.form.errors.minPass`))
        .max(25, t(`settings.changePassword.form.errors.maxPass`))
        .matches(
          /[A-Z]/,
          t(`settings.changePassword.form.errors.passUppercase`),
        )
        .matches(
          /[a-z]/,
          t(`settings.changePassword.form.errors.passLowercase`),
        )
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
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        checkIamAlreadyMember();
        const res = await axios.post(
          `${BASE_URL}/auth/change-password`,
          {
            password: values?.password.trim(),
            oldPassword: values.currentPassword,
          },
          {
            headers: {
              "Accept-Language": i18n.language,
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          },
        );

        if (res?.data?.success) {
          resetForm();
          enqueueSnackbar(t("settings.changePassword.passChangedSuccess"), {
            variant: "success",
          });
        }
      } catch (error) {
        console.error("change password error:", error.response?.data);
        enqueueSnackbar(error?.response?.data?.message || error?.message, {
          variant: "error",
        });
        if (error?.response?.status === 401) {
          Cookies.remove("token");
          Cookies.remove("user");
          navigate("/login");
        }
      }
    },
  });

  return (
    <div className="w-full pt-2">
      <h1 className="font-semibold text-[24px]">
        {t(`settings.changePassword.changePassword`)}
      </h1>
      <div className="w-full border my-5" />

      <form onSubmit={formik.handleSubmit} className="w-full space-y-5 mt-5">
        <PasswordField
          name="currentPassword"
          placeholder={t(`settings.changePassword.form.currentPass`)}
          value={formik.values.currentPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.currentPassword}
          touched={formik.touched.currentPassword}
        />
        <PasswordField
          name="password"
          placeholder={t(`settings.changePassword.form.newPass`)}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.password}
          touched={formik.touched.password}
        />

        <PasswordField
          name="confirmPassword"
          placeholder={t(`settings.changePassword.form.confirmPass`)}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.confirmPassword}
          touched={formik.touched.confirmPassword}
        />

        <div className="w-full flex justify-end mt-5">
          <button
            type="submit"
            className="bg-[var(--button-bg)] button max-w-[150px]"
          >
            {t(`settings.buttons.save`)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
