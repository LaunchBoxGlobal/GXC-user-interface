import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import TextField from "../../components/Common/TextField";
import { useFormik } from "formik";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import * as Yup from "yup";
import { getToken } from "../../utils/getToken";
import PhoneNumberField from "../../components/Common/PhoneNumberField";
import { enqueueSnackbar } from "notistack";
import i18n from "i18next";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import Loader from "../../components/Common/Loader";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useUser } from "../../context/userContext";
import { handleApiError } from "../../utils/handleApiError";
import EditProfilePicture from "./EditProfilePicture";
import { useTranslation } from "react-i18next";

const EditProfile = () => {
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { user, fetchUserProfile } = useAppContext();
  const { checkIamAlreadyMember } = useUser();
  const [loading, setLoading] = useState(false);

  const parsedPhone = parsePhoneNumberFromString(user?.phone || "");
  const defaultCountry = parsedPhone ? parsedPhone.country : "US";
  const defaultPhoneNumber = parsedPhone ? parsedPhone.number : "";

  const { t } = useTranslation("editProfile");

  useEffect(() => {
    document.title = "Edit Profile - GiveXChange";
    checkIamAlreadyMember();
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user?.profilePicture) {
      setPreview(user.profilePictureUrl);
    }
  }, [user]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      address: user?.address || "",
      phoneNumber: defaultPhoneNumber || "",
      city: user?.city || "",
      zipcode: user?.zipcode || "",
      state: user?.state || "",
      country: "United States",
      countryId: 233,
      profileImage: null,
      stateId: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(3, t("editProfile.form.errors.firstNameMin"))
        .max(10, t("editProfile.form.errors.firstNameMax"))
        .matches(/^[a-zA-Z ]*$/, t("editProfile.form.errors.firstNameMatch"))
        .required(t("editProfile.form.errors.firstNameRequired")),

      lastName: Yup.string()
        .min(3, t("editProfile.form.errors.lastNameMin"))
        .max(10, t("editProfile.form.errors.lastNameMax"))
        .matches(/^[a-zA-Z ]*$/, t("editProfile.form.errors.lastNameMatch"))
        .required(t("editProfile.form.errors.lastNameRequired")),

      address: Yup.string()
        .min(1, t("editProfile.form.errors.addressMin"))
        .max(30, t("editProfile.form.errors.addressMax"))
        .required(t("editProfile.form.errors.addressRequired")),

      phoneNumber: Yup.string()
        .required(t("editProfile.form.errors.phoneNumberRequired"))
        .test(
          "is-valid-phone",
          t("editProfile.form.errors.invalidPhoneNumber"),
          function (value) {
            const { parent } = this;
            const country = parent.country || defaultCountry || "US";

            if (!value) return false;

            try {
              const phone = parsePhoneNumberFromString(value, country);
              return phone && phone.isValid();
            } catch {
              return false;
            }
          },
        ),

      email: Yup.string()
        .email(t("editProfile.form.errors.invalidEmail"))
        .required(t("editProfile.form.errors.emailIsRequired")),

      city: Yup.string().required(t("editProfile.form.errors.cityRequired")),

      state: Yup.string().required(t("editProfile.form.errors.stateRequired")),

      country: Yup.string().required(
        t("editProfile.form.errors.countryRequired"),
      ),

      zipcode: Yup.string()
        .matches(
          /^[A-Za-z0-9\- ]{4,10}$/,
          t("editProfile.form.errors.zipCodeMatch"),
        )
        .required(t("editProfile.form.errors.zipCodeIsRequired")),

      profileImage: Yup.mixed().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        checkIamAlreadyMember();
        setLoading(true);
        const profileRes = await axios.put(
          `${BASE_URL}/auth/profile`,
          {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim(),
            phone: values.phoneNumber,
            address: values.address.trim(),
            city: values.city.trim(),
            zipcode: values.zipcode.trim(),
            state: values.state.trim(),
            country: values.country.trim(),
          },
          {
            headers: {
              "Accept-Language": i18n.language,
              "Content-Type": "application/json",
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
                "Accept-Language": i18n.language,
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${getToken()}`,
              },
            },
          );
        }

        if (profileRes?.data?.success) {
          resetForm();
          fetchUserProfile();
          enqueueSnackbar(
            profileRes?.data?.message ||
              t(`editProfile.form.profileUpdatedSuccess`),
            {
              variant: "success",
            },
          );
          navigate(-1 || "/profile");
        }
      } catch (error) {
        handleApiError(error, navigate);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col items-center w-full bg-white padding-x py-20"
    >
      <h1 className="font-semibold text-[32px] leading-[1]">
        {t("editProfile.editProfile")}
      </h1>
      <p className="font-medium mt-3">
        {t("editProfile.editProfileSubheading")}
      </p>

      <div className="w-full max-w-[500px] my-6">
        <EditProfilePicture
          name="profileImage"
          setFieldValue={formik.setFieldValue}
          imagePreview={preview}
          error={formik.touched.profileImage && formik.errors.profileImage}
        />
      </div>

      <div className="w-full max-w-[500px] flex flex-col items-center gap-4">
        <div className="w-full grid grid-cols-2 gap-2">
          <TextField
            type="text"
            name="firstName"
            placeholder={t("editProfile.form.fields.firstNameLabel")}
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.firstName}
            touched={formik.touched.firstName}
            label={t("editProfile.form.fields.firstNameLabel")}
          />
          <TextField
            type="text"
            name="lastName"
            placeholder={t("editProfile.form.fields.lastNameLabel")}
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.lastName}
            touched={formik.touched.lastName}
            label={t("editProfile.form.fields.lastNameLabel")}
          />
        </div>
        <div className="w-full">
          <TextField
            type="text"
            name="email"
            placeholder=""
            disabled={true}
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
            label={t("editProfile.form.fields.emailAddress")}
          />
        </div>
        <div className="w-full">
          <label htmlFor="phoneNumber" className="font-medium text-sm">
            {t("editProfile.form.fields.emailAddress")}
          </label>
          <PhoneNumberField
            type="text"
            name="phoneNumber"
            placeholder=""
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.phoneNumber}
            touched={formik.touched.phoneNumber}
            defaultCountry={defaultCountry}
          />
        </div>

        <div className="w-full grid grid-cols-2 gap-3">
          <div className="w-full flex flex-col gap-1">
            <label className="text-sm font-medium">
              {t("editProfile.form.fields.country")}
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
                inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none bg-[var(--secondary-bg)] text-gray-500 disabled:cursor-not-allowed ${
                  formik.touched.country && formik.errors.country
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                placeHolder={t("editProfile.form.fields.country")}
                onChange={(val) => {
                  formik.setFieldValue("country", val.name);
                  formik.setFieldValue("countryId", val.id);
                  formik.setFieldValue("state", "");
                  formik.setFieldValue("city", "");
                }}
              />
            </div>
            {formik.touched.country && formik.errors.country && (
              <p className="text-red-500 text-xs">{formik.errors.country}</p>
            )}
          </div>
          <div className="w-full flex flex-col gap-1">
            <label className="text-sm font-medium">
              {t("editProfile.form.fields.state")}
            </label>
            <StateSelect
              countryid={formik.values.countryId || undefined}
              containerClassName="w-full"
              inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none bg-[var(--secondary-bg)] text-gray-500 ${
                formik.touched.state && formik.errors.state
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              placeHolder={t("editProfile.form.fields.state")}
              onChange={(val) => {
                formik.setFieldValue("state", val.name);
                formik.setFieldValue("stateId", val.id);
                formik.setFieldValue("city", "");
              }}
              defaultValue={
                formik.values.state ? { name: formik.values.state } : null
              }
            />
            {formik.touched.state && formik.errors.state && (
              <p className="text-red-500 text-xs">{formik.errors.state}</p>
            )}
          </div>
        </div>

        <div className="w-full grid grid-cols-2 gap-3">
          <div className="w-full flex flex-col gap-1">
            <label className="text-sm font-medium">
              {t("editProfile.form.fields.city")}
            </label>
            <CitySelect
              countryid={formik.values.countryId || undefined}
              stateid={formik.values.stateId || undefined}
              containerClassName="w-full"
              inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none text-gray-500 bg-[var(--secondary-bg)] ${
                formik.touched.city && formik.errors.city
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              placeHolder={t("editProfile.form.fields.city")}
              onChange={(val) => formik.setFieldValue("city", val.name)}
              defaultValue={
                formik.values.city ? { name: formik.values.city } : null
              }
            />
            {formik.touched.city && formik.errors.city && (
              <p className="text-red-500 text-xs">{formik.errors.city}</p>
            )}
          </div>

          <TextField
            type="text"
            name="zipcode"
            placeholder={t("editProfile.form.fields.zipCode")}
            value={formik.values.zipcode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.zipcode}
            touched={formik.touched.zipcode}
            label={t("editProfile.form.fields.zipCode")}
          />
        </div>

        <div className="w-full">
          <TextField
            type="text"
            name="address"
            placeholder={t("editProfile.form.fields.location")}
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.address}
            touched={formik.touched.address}
            label={t("editProfile.form.fields.location")}
          />
        </div>

        <div className="w-full">
          <button
            type="submit"
            disabled={loading}
            className="button disabled:cursor-not-allowed"
          >
            {loading ? <Loader /> : t("editProfile.buttons.save")}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditProfile;
