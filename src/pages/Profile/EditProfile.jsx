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

const EditProfile = () => {
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { user, fetchUserProfile } = useAppContext();
  const { checkIamAlreadyMember } = useUser();
  const [loading, setLoading] = useState(false);

  const parsedPhone = parsePhoneNumberFromString(user?.phone || "");
  const defaultCountry = parsedPhone ? parsedPhone.country : "US";
  const defaultPhoneNumber = parsedPhone ? parsedPhone.number : "";

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
        .min(3, "First name must contain at least 3 characters")
        .max(10, "First name must be 10 characters or less")
        .matches(
          /^[a-zA-Z ]*$/,
          "First name can only contain letters and spaces"
        )
        .required("First name is required"),
      lastName: Yup.string()
        .min(3, "Last name must contain at least 3 characters")
        .max(10, "Last name must be 10 characters or less")
        .matches(
          /^[a-zA-Z ]*$/,
          "Last name can only contain letters and spaces"
        )
        .required("Last name is required"),
      address: Yup.string()
        .min(1, `Address cannot be less than 1 characters`)
        .max(30, `Address can not be more than 150 characters`)
        .required("Please enter your location"),
      phoneNumber: Yup.string()
        .required("Phone number is required")
        .test("is-valid-phone", "Invalid phone number", function (value) {
          const { parent } = this;
          const country = parent.country || defaultCountry || "US";

          if (!value) return false;

          try {
            const phone = parsePhoneNumberFromString(value, country);
            return phone && phone.isValid();
          } catch {
            return false;
          }
        }),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      city: Yup.string().required("Enter your city"),
      state: Yup.string().required("Enter your state"),
      country: Yup.string().required("Enter your country"),
      zipcode: Yup.string()
        .matches(/^[A-Za-z0-9\- ]{4,10}$/, "Please enter a valid zip code")
        .required("Enter your zip code"),
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
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (values.profileImage instanceof File) {
          const formData = new FormData();
          formData.append("profilePicture", values.profileImage);

          await axios.post(
            `${BASE_URL}/auth/upload-profile-picture`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );
        }

        if (profileRes?.data?.success) {
          resetForm();
          fetchUserProfile();
          enqueueSnackbar(
            profileRes?.data?.message || "Profile Updated Successfully!",
            {
              variant: "success",
            }
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
      <h1 className="font-semibold text-[32px] leading-[1]">Edit Profile</h1>
      <p className="font-medium mt-3">
        Please complete details to access all features
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
            placeholder="First Name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.firstName}
            touched={formik.touched.firstName}
            label={"First Name"}
          />
          <TextField
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.lastName}
            touched={formik.touched.lastName}
            label={"First Name"}
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
            label={"Email Address"}
          />
        </div>
        <div className="w-full">
          <label htmlFor="phoneNumber" className="font-medium text-sm">
            Phone Number
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
            <label className="text-sm font-medium">Country</label>
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
                placeHolder="Select Country"
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
            <label className="text-sm font-medium">State</label>
            <StateSelect
              countryid={formik.values.countryId || undefined}
              containerClassName="w-full"
              inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none bg-[var(--secondary-bg)] text-gray-500 ${
                formik.touched.state && formik.errors.state
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              placeHolder="Select State"
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
            <label className="text-sm font-medium">City</label>
            <CitySelect
              countryid={formik.values.countryId || undefined}
              stateid={formik.values.stateId || undefined}
              containerClassName="w-full"
              inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none text-gray-500 bg-[var(--secondary-bg)] ${
                formik.touched.city && formik.errors.city
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
              placeHolder="Select City"
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
            placeholder="Enter zip code"
            value={formik.values.zipcode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.zipcode}
            touched={formik.touched.zipcode}
            label="Zip Code"
          />
        </div>

        <div className="w-full">
          <TextField
            type="text"
            name="address"
            placeholder=""
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.address}
            touched={formik.touched.address}
            label={"Suite / Apartment / Street"}
          />
        </div>

        <div className="w-full">
          <button
            type="submit"
            disabled={loading}
            className="button disabled:cursor-not-allowed"
          >
            {loading ? <Loader /> : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditProfile;
