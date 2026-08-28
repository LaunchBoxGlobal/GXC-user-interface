import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import TextField from "../Common/TextField";
import AuthImageUpload from "../Common/AuthImageUpload";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import Cookies from "js-cookie";
import { getToken } from "../../utils/getToken";
import AccountSuccessPopup from "../Popups/AccountSuccessPopup";
import PhoneNumberField from "../Common/PhoneNumberField";
import { enqueueSnackbar } from "notistack";
import i18next from "i18next";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import { profileSchema } from "../../validation/profileSchema";
import { requestNotificationPermission } from "../../notifications";
import { useTranslation } from "react-i18next";

const CompleteProfileForm = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(Cookies.get("user"));
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const redirect = searchParams?.get("redirect");
  const [showPopup, setShowPopup] = useState(false);
  Cookies.remove("userEmail");

  const { t } = useTranslation("auth");

  const togglePopup = () => setShowPopup((prev) => !prev);

  useEffect(() => {
    document.title = `Complete Profile - GiveXChange`;
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      email: userData?.email || "",
      phoneNumber: "",
      location: "",
      profileImage: null,
      zipcode: "",
      city: "",
      state: "",
      country: "United States",
      countryId: 233,
      stateId: "",
    },
    validateOnChange: false,
    validateOnBlur: true,
    validationSchema: profileSchema(t),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const profileRes = await axios.put(
          `${BASE_URL}/auth/profile`,
          {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim(),
            address: values.location.trim(),
            phone: values.phoneNumber,
            zipcode: values.zipcode.trim(),
            city: values.city.trim(),
            state: values.state.trim(),
            country: values.country.trim(),
          },
          {
            headers: {
              "Accept-Language": i18next.language,
              Authorization: `Bearer ${getToken()}`,
            },
          },
        );

        if (values.profileImage instanceof File) {
          const formData = new FormData();
          formData.append("profilePicture", values.profileImage);
          await axios.post(
            `${BASE_URL}/auth/upload-profile-picture`,
            formData,
            {
              headers: {
                "Accept-Language": i18next.language,
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${getToken()}`,
              },
            },
          );
        }

        if (profileRes?.data?.success) {
          resetForm();
          togglePopup();
          Cookies.remove(`userEmail`);
          Cookies.remove(`verifyEmail`);
          Cookies.remove("signupEmail");
          requestNotificationPermission();
        }
      } catch (error) {
        enqueueSnackbar(
          error.response?.data?.errors[0]?.message ||
            error.response?.data?.message ||
            error?.message,
          {
            variant: "error",
          },
        );
        if (error?.response?.status === 401) {
          Cookies.remove("userToken");
          Cookies.remove("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  const handleChange = async (e) => {
    const { name, value } = e.target;

    formik.setFieldValue(name, value);

    // Mark ONLY this field as touched while typing
    formik.setFieldTouched(name, true, false);

    // Validate ONLY this field
    await formik.validateField(name);
  };

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-[500px] flex flex-col items-start gap-4"
      >
        <div className="w-full text-center space-y-3">
          <h1 className="font-semibold text-[32px] leading-none">
            {t("completeProfile.title")}
          </h1>
          <p className="text-[var(--secondary-color)]">
            {t("completeProfile.subtitle")}
          </p>
        </div>

        <div className="w-full h-[100px] flex flex-col items-center justify-center gap-2 my-3">
          <AuthImageUpload
            name="profileImage"
            setFieldValue={formik.setFieldValue}
            error={formik.touched.profileImage && formik.errors.profileImage}
          />
        </div>

        <h2 className="font-semibold text-[24px] leading-none w-full">
          {t("completeProfile.basicDetails")}
        </h2>

        <div className="w-full space-y-3">
          <div className="w-full grid grid-cols-2 gap-3">
            <TextField
              type="text"
              name="firstName"
              placeholder={t("completeProfile.placeholders.firstName")}
              value={formik.values.firstName}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.firstName}
              touched={formik.touched.firstName}
            />
            <TextField
              type="text"
              name="lastName"
              placeholder={t("completeProfile.placeholders.lastName")}
              value={formik.values.lastName}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.lastName}
              touched={formik.touched.lastName}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              type="text"
              name="email"
              disabled={true}
              placeholder={t("completeProfile.placeholders.email")}
              value={formik.values.email}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.email}
              touched={formik.touched.email}
              label={t("completeProfile.email")}
            />

            <PhoneNumberField
              type="text"
              name="phoneNumber"
              placeholder={t("completeProfile.placeholders.phoneNumber")}
              value={formik.values.phoneNumber}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.phoneNumber}
              touched={formik.touched.phoneNumber}
              label={t("completeProfile.phoneNumber")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full flex flex-col gap-1">
              <label className="text-sm font-medium">
                {t("completeProfile.country")}
              </label>
              <div className="w-full pointer-events-none">
                <CountrySelect
                  defaultValue={{
                    id: 233,
                    name: "United States",
                    iso2: "US",
                    iso3: "USA",
                  }}
                  disabled={true}
                  containerClassName="w-full"
                  inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none disabled:cursor-not-allowed text-gray-500
        ${
          formik.touched.country && formik.errors.country
            ? "border-red-500"
            : "border-gray-200"
        }
      `}
                  placeHolder={t("completeProfile.placeholders.country")}
                  onChange={(val) => {
                    formik.setFieldValue("country", val.name);
                    formik.setFieldValue("countryId", val.id);
                    formik.setFieldValue("state", "");
                    formik.setFieldValue("stateId", "");
                    formik.setFieldValue("city", "");
                  }}
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-1">
              <label className="text-sm font-medium">
                {t("completeProfile.state")}
              </label>
              <StateSelect
                countryid={formik.values.countryId || 0}
                containerClassName="w-full"
                inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none text-gray-500 
        ${
          // FIX (issue #2): also redden after a submit attempt (submitCount > 0),
          // not just when `touched.state` happens to be set. This guarantees
          // the field matches every other field's behavior on an empty submit.
          (formik.touched.state || formik.submitCount > 0) &&
          formik.errors.state
            ? "border-red-500"
            : "border-gray-200"
        }
      `}
                placeHolder={t("completeProfile.placeholders.state")}
                onChange={(val) => {
                  // FIX (issue #1): update state + stateId + reset city in ONE
                  // atomic update and validate immediately (shouldValidate = true)
                  // so the error is computed against the value we just picked,
                  // not a stale pre-selection snapshot. Also mark the field
                  // touched right away instead of waiting for some other
                  // field's onBlur to trigger a full-form validation pass.
                  formik.setValues(
                    (prev) => ({
                      ...prev,
                      state: val.name,
                      stateId: val.id,
                      city: "",
                    }),
                    true,
                  );
                  formik.setFieldTouched("state", true, false);
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full flex flex-col gap-1">
              <label className="text-sm font-medium">
                {t("completeProfile.city")}
              </label>
              <CitySelect
                countryid={formik.values.countryId || 0}
                stateid={formik.values.stateId || 0}
                containerClassName="w-full"
                inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none text-gray-500 
        ${
          // Same submitCount fallback as State, for the same reason.
          (formik.touched.city || formik.submitCount > 0) && formik.errors.city
            ? "border-red-500"
            : "border-gray-200"
        }
      `}
                placeHolder={t("completeProfile.placeholders.city")}
                onChange={(val) => {
                  // Same fix as State: validate immediately and mark touched.
                  formik.setFieldValue("city", val.name, true);
                  formik.setFieldTouched("city", true, false);
                }}
              />
            </div>

            <TextField
              type="text"
              name="zipcode"
              placeholder={t("completeProfile.placeholders.zipcode")}
              value={formik.values.zipcode}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.zipcode}
              touched={formik.touched.zipcode}
              label={t("completeProfile.zipcode")}
            />
          </div>

          <TextField
            type="text"
            name="location"
            placeholder={t("completeProfile.placeholders.address")}
            value={formik.values.location}
            onChange={handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.location}
            touched={formik.touched.location}
            label={t("completeProfile.address")}
          />

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                requestNotificationPermission();
                navigate(redirect ? redirect : `/`);
              }}
              className="text-sm font-medium flex items-center gap-1 text-black"
            >
              {t("completeProfile.buttons.skip")}
            </button>
            <div className="w-full max-w-[110px]">
              <Button
                type="submit"
                title={t("completeProfile.buttons.save")}
                isLoading={loading}
              />
            </div>
          </div>
        </div>
      </form>

      <AccountSuccessPopup
        showPopup={showPopup}
        togglePopup={togglePopup}
        redirect={redirect}
      />
    </>
  );
};

export default CompleteProfileForm;
