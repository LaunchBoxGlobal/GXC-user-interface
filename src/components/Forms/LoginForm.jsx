import { useEffect, useState } from "react";
import TextField from "../Common/TextField";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import PasswordField from "../Common/PasswordField";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import Cookies from "js-cookie";
import { enqueueSnackbar } from "notistack";
import { useAppContext } from "../../context/AppContext";
import { useUser } from "../../context/userContext";
import { requestNotificationPermission } from "../../notifications";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../LanguageSwitcher";
import i18n from "i18next";

const LoginForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppContext();
  const { fetchCommunities } = useUser();
  const { t } = useTranslation("auth");

  const redirect = searchParams?.get("redirect");

  useEffect(() => {
    document.title = `Login - GiveXChange`;
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",

      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("auth:errors.invalid_email"))
        .required(t("auth:errors.email_required")),
      password: Yup.string().required(t("auth:errors.password_required")),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const res = await axios.post(
          `${BASE_URL}/auth/login`,
          {
            email: values?.email.trim(),
            password: values?.password.trim(),
            userType: "regular_user",
          },
          {
            headers: {
              "Accept-Language": i18n.language,
              "Content-Type": "application/json",
            },
          },
        );

        if (res?.data?.success) {
          Cookies.set("userToken", res?.data?.data?.token);
          Cookies.set("user", JSON.stringify(res?.data?.data?.user));
          setUser(res?.data?.data?.user);
          resetForm();
          fetchCommunities();
          requestNotificationPermission();
          if (redirect) {
            navigate(redirect.startsWith("/") ? redirect : `/${redirect}`);
          } else {
            navigate(`/${redirect ? `?community=${redirect}` : ""}`);
          }
        }
      } catch (error) {
        const apiRes = error?.response?.data;

        if (
          apiRes?.message === "Please verify your email before logging in" &&
          apiRes?.data?.token
        ) {
          const newToken = apiRes.data.token;
          Cookies.set("token", newToken);
          Cookies.set("userToken", newToken);

          try {
            const resendRes = await axios.post(
              `${BASE_URL}/auth/resend-verification`,
              { email: values.email },
              {
                headers: {
                  "Accept-Language": i18n.language,
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${newToken}`,
                },
              },
            );

            if (resendRes?.data?.success) {
              Cookies.set("userEmail", values.email);
              Cookies.set("page", "/login");
              resetForm();

              enqueueSnackbar(resendRes.data.message, {
                variant: "success",
              });
              navigate(
                `/verify-otp${redirect ? `?redirect=${redirect}` : ""}`,
                {
                  state: {
                    email: values.email,
                    page: "/login",
                  },
                },
              );
            }
          } catch (err) {
            // console.error("verify email error:", err);
            enqueueSnackbar(err.response?.data?.message || err.message, {
              variant: "success",
            });
          }
        } else {
          // for all other errors show normal error
          enqueueSnackbar(apiRes?.message || error?.message, {
            variant: "error",
          });
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="w-full max-w-[350px] flex flex-col items-start gap-4"
    >
      {/* <LanguageSwitcher /> */}
      <img
        src="/logo.svg"
        alt="logo"
        className="w-[167px] lg:w-[267px] object-contain mx-auto"
      />

      <div className="w-full text-center space-y-3">
        <h2 className="font-semibold text-[32px] leading-none">
          {t(`auth.welcome`)}
        </h2>
        <p className="text-[var(--secondary-color)]">
          {t(`auth.login_subheading`)}
        </p>
      </div>

      <div className="w-full flex flex-col items-start gap-4 mt-3">
        <div className="w-full space-y-1">
          <TextField
            type="text"
            name="email"
            placeholder="johndoe@gmail.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
            label={t(`form.email_label`)}
          />
        </div>

        <div className="w-full space-y-1">
          <PasswordField
            name={`password`}
            placeholder={`Password`}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
            label={t(`form.password`)}
          />
        </div>

        <div className="w-full text-end">
          <Link
            to={
              redirect
                ? `/forgot-password?redirect=${redirect}`
                : "/forgot-password"
            }
            className="text-xs font-medium"
          >
            {t(`form.forgot_password`)}
          </Link>
        </div>

        <div className="pt-2 w-full">
          <Button
            type={"submit"}
            title={t(`button.login_button`)}
            isLoading={loading}
          />
        </div>
      </div>

      {redirect &&
        redirect !== "/" &&
        redirect.trim() !== "" &&
        redirect.includes("/community") && (
          <>
            <div className="w-full flex items-center justify-between gap-6 mt-4">
              <div className="w-full border border-gray-300" />
              <p className="text-gray-400 font-medium">OR</p>
              <div className="w-full border border-gray-300" />
            </div>

            <div className="w-full mt-2 flex flex-col items-center gap-4">
              <div className="w-full flex items-center justify-center gap-1">
                <p className="text-[var(--secondary-color)]">
                  {t(`auth.DontHaveAnAccount`)}{" "}
                </p>
                <Link
                  to={redirect ? `/signup?redirect=${redirect}` : "/signup"}
                  className="font-medium text-[var(--button-bg)]"
                >
                  {t(`signup.title`)}
                </Link>
              </div>
            </div>
          </>
        )}
    </form>
  );
};

export default LoginForm;
