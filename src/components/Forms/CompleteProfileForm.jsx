import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import TextField from "../Common/TextField";
import AuthImageUpload from "../Common/AuthImageUpload";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import Cookies from "js-cookie";
import { getToken } from "../../utils/getToken";
import AccountSuccessPopup from "../Popups/AccountSuccessPopup";
import PhoneNumberField from "../Common/PhoneNumberField";
import { enqueueSnackbar } from "notistack";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";

const CompleteProfileForm = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(Cookies.get("user"));
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  Cookies.remove("userEmail");

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
      country: "",
      countryId: "",
      stateId: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .min(3, "First name must contain at least 3 characters")
        .max(10, "First name must be 10 characters or less")
        .matches(
          /^[A-Z][a-zA-Z ]*$/,
          "First must start with a capital letter and contain only letters and spaces"
        )
        .required("First name is required"),
      lastName: Yup.string()
        .min(3, "Last name must contain at least 3 characters")
        .max(10, "Last name must be 10 characters or less")
        .matches(
          /^[A-Z][a-zA-Z ]*$/,
          "Last name must start with a capital letter and contain only letters and spaces"
        )
        .required("Last name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phoneNumber: Yup.string()
        .matches(/^[0-9]{11}$/, "Phone number must contain 11 digits")
        .required("Enter your phone number"),
      location: Yup.string()
        .min(11, `Address cannot be less than 11 characters`)
        .max(150, `Address can not be more than 150 characters`)
        .required("Please enter your location"),
      zipcode: Yup.string()
        .matches(/^[0-9]{5}$/, "Zip code must contain 5 digits")
        .required("Enter your zip code"),
      city: Yup.string().required("Enter your city"),
      state: Yup.string().required("Enter your state"),
      country: Yup.string().required("Enter your country"),
      profileImage: Yup.mixed().nullable(),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const profileRes = await axios.put(
          `${BASE_URL}/auth/profile`,
          {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            address: values.location,
            phone: values.phoneNumber,
            zipcode: values.zipcode,
            city: values.city,
            state: values.state,
            country: values.country,
          },
          {
            headers: { Authorization: `Bearer ${getToken()}` },
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
          togglePopup();
          Cookies.remove(`userEmail`);
          Cookies.remove(`verifyEmail`);
          Cookies.remove("signupEmail");
        }
      } catch (error) {
        console.error("complete profile error:", error);
        enqueueSnackbar(error.response?.data?.message || error?.message, {
          variant: "error",
        });
        if (error?.response?.status === 401) {
          Cookies.remove("token");
          Cookies.remove("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <>
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-[500px] flex flex-col items-start gap-4"
      >
        {/* Heading */}
        <div className="w-full text-center space-y-3">
          <h1 className="font-semibold text-[32px] leading-none">
            Complete Profile Details
          </h1>
          <p className="text-[var(--secondary-color)]">
            Please complete details to access all features
          </p>
        </div>

        {/* Profile image */}
        <div className="w-full h-[100px] flex flex-col items-center justify-center gap-2 my-3">
          <AuthImageUpload
            name="profileImage"
            setFieldValue={formik.setFieldValue}
            error={formik.touched.profileImage && formik.errors.profileImage}
          />
        </div>

        {/* Basic details */}
        <h2 className="font-semibold text-[24px] leading-none w-full">
          Basic Details
        </h2>

        <div className="w-full space-y-3">
          <div className="w-full grid grid-cols-2 gap-3">
            <TextField
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.firstName}
              touched={formik.touched.firstName}
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
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TextField
              type="text"
              name="email"
              disabled={true}
              placeholder="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.email}
              touched={formik.touched.email}
              label="Email Address"
            />

            <PhoneNumberField
              type="text"
              name="phoneNumber"
              placeholder="+000 0000 00"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.phoneNumber}
              touched={formik.touched.phoneNumber}
              label="Phone Number"
            />
          </div>

          {/* Country, State, City, Zip */}
          <div className="grid grid-cols-2 gap-4">
            <div className="w-full flex flex-col gap-1">
              <label className="text-sm font-medium">Country</label>
              <CountrySelect
                containerClassName="w-full"
                inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none 
        ${
          formik.touched.country && formik.errors.country
            ? "border-red-500"
            : "border-gray-200"
        }
      `}
                placeHolder="Select Country"
                onChange={(val) => {
                  formik.setFieldValue("country", val.name);
                  formik.setFieldValue("countryId", val.id);
                  formik.setFieldValue("state", "");
                  formik.setFieldValue("stateId", "");
                  formik.setFieldValue("city", "");
                }}
              />
              {formik.touched.country && formik.errors.country && (
                <p className="text-red-500 text-xs">{formik.errors.country}</p>
              )}
            </div>

            <div className="w-full flex flex-col gap-1">
              <label className="text-sm font-medium">State</label>
              <StateSelect
                countryid={formik.values.countryId || 0}
                containerClassName="w-full"
                inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none 
        ${
          formik.touched.state && formik.errors.state
            ? "border-red-500"
            : "border-gray-200"
        }
      `}
                placeHolder="Select State"
                onChange={(val) => {
                  formik.setFieldValue("state", val.name);
                  formik.setFieldValue("stateId", val.id);
                  formik.setFieldValue("city", "");
                }}
              />
              {formik.touched.state && formik.errors.state && (
                <p className="text-red-500 text-xs">{formik.errors.state}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full flex flex-col gap-1">
              <label className="text-sm font-medium">City</label>
              <CitySelect
                countryid={formik.values.countryId || 0}
                stateid={formik.values.stateId || 0}
                containerClassName="w-full"
                inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none 
        ${
          formik.touched.city && formik.errors.city
            ? "border-red-500"
            : "border-gray-200"
        }
      `}
                placeHolder="Select City"
                onChange={(val) => formik.setFieldValue("city", val.name)}
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

          <TextField
            type="text"
            name="location"
            placeholder="Enter your address"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.location}
            touched={formik.touched.location}
            label="Home Address"
          />

          {/* Buttons */}
          <div className="pt-2 flex items-center justify-between">
            <Link
              to={`/`}
              className="text-sm font-medium flex items-center gap-1 text-black"
            >
              Skip
            </Link>
            <div className="w-full max-w-[110px]">
              <Button type="submit" title="Save" isLoading={loading} />
            </div>
          </div>
        </div>
      </form>
      <AccountSuccessPopup showPopup={showPopup} togglePopup={togglePopup} />
    </>
  );
};

export default CompleteProfileForm;
