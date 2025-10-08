import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../Common/Button";
import PasswordField from "../Common/PasswordField";
import TextField from "../Common/TextField";
import AuthImageUpload from "../Common/AuthImageUpload";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import Cookies from "js-cookie";
import { useAppContext } from "../../context/AppContext";
import { getToken } from "../../utils/getToken";
import AccountSuccessPopup from "../Popups/AccountSuccessPopup";
import PhoneNumberField from "../Common/PhoneNumberField";
import { enqueueSnackbar } from "notistack";

const CompleteProfileForm = () => {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const userData = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [searchParams] = useSearchParams();
  const redirect = searchParams?.get("redirect");
  const [value, setValue] = useState();

  const togglePopup = () => {
    setShowPopup((prev) => !prev);
  };

  useEffect(() => {
    document.title = `Complete Profile - GiveXChange`;
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: userData?.fullName || "",
      email: userData?.email || "",
      phoneNumber: "",
      location: "",
      // description: "",
      profileImage: null,
      zipcode: "",
      city: "",
      state: "",
      country: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .min(3, "Name must contain at least 3 characters")
        .max(30, "Name must be 30 characters or less")
        .matches(
          /^[A-Z][a-zA-Z ]*$/,
          "Name must start with a capital letter and contain only letters and spaces"
        )
        .required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phoneNumber: Yup.string()
        .matches(/^[0-9]{11}$/, "Phone number must contain 11 digits")
        .required("Enter your phone number"),
      // description: Yup.string()
      //   .min(30, `Description can not be less than 30 characters`)
      //   .max(500, `Description can not be more than 500 characters`)
      //   .required("Please enter description"),
      location: Yup.string()
        .min(11, `Address cannot be less than 11 characters`)
        .max(150, `Address cannot be more than 150 characters`)
        .required("Enter your address"),
      zipcode: Yup.string()
        .matches(/^[0-9]{5}$/, "Zip code must contain 5 digits")
        .required("Enter your zip code"),
      city: Yup.string()
        .min(3, `City name cannot be less than 11 characters`)
        .max(15, `City name cannot be more than 15 characters`)
        .required("Enter your city"),
      state: Yup.string()
        .min(3, `State cannot be less than 11 characters`)
        .max(15, `State can not be more than 15 characters`)
        .required("Enter your state"),
      country: Yup.string()
        .min(3, `Country name cannot be less than 11 characters`)
        .max(15, `Country name cannot be more than 15 characters`)
        .required("Enter your country"),
      profileImage: Yup.mixed().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const profileRes = await axios.put(
          `${BASE_URL}/auth/profile`,
          {
            fullName: values.name,
            email: values.email,
            // description: values.description,
            address: values.location,
            phone: values.phoneNumber,
            city: values.city,
            zipcode: values.zipcode,
            state: values.state,
            country: values.country,
          },
          {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );

        if (values.profileImage instanceof File) {
          const formData = new FormData();
          formData.append("profilePicture", values.profileImage);

          const imageRes = await axios.post(
            `${BASE_URL}/auth/upload-profile-picture`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${getToken()}`,
              },
            }
          );
          console.log("Image uploaded response:", imageRes.data);
        }

        if (profileRes?.data?.success) {
          resetForm();

          // alert("Profile Updated Successfully!");
          // navigate("/");
          togglePopup();
        }
      } catch (error) {
        console.error("Sign up error:", error.response?.data);
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
        <div className="w-full text-center space-y-3">
          <h1 className="font-semibold text-[32px] leading-none">
            Complete Profile Details
          </h1>
          <p className="text-[var(--secondary-color)]">
            Please complete details to access all features
          </p>
        </div>

        <div className="w-full h-[100px] flex flex-col items-center justify-center gap-2 my-3">
          <AuthImageUpload
            name="profileImage"
            setFieldValue={formik.setFieldValue}
            error={formik.touched.profileImage && formik.errors.profileImage}
          />
        </div>

        <div className="w-full">
          <h2 className="font-semibold text-[24px] leading-none">
            Basic Details
          </h2>
        </div>
        <div className="w-full space-y-3">
          <TextField
            type="text"
            name="name"
            placeholder="Full Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.name}
            touched={formik.touched.name}
            label={`Full Name`}
          />

          <div className="w-full grid grid-cols-2 gap-4">
            <TextField
              type="text"
              name="email"
              placeholder="Email Address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.email}
              touched={formik.touched.email}
              label={"Email Address"}
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
              label={"Phone Number"}
            />
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            <TextField
              type="text"
              name="city"
              placeholder="Enter your city"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.city}
              touched={formik.touched.city}
              label={"City"}
            />{" "}
            <TextField
              type="text"
              name="zipCode"
              placeholder="Enter zip code"
              value={formik.values.zipcode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.zipcode}
              touched={formik.touched.zipcode}
              label={"Zip Code"}
            />
          </div>

          <div className="w-full grid grid-cols-2 gap-4">
            <TextField
              type="text"
              name="state"
              placeholder="Enter your state"
              value={formik.values.state}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.state}
              touched={formik.touched.state}
              label={"State"}
            />{" "}
            <TextField
              type="text"
              name="country"
              placeholder="Enter your country name"
              value={formik.values.country}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.country}
              touched={formik.touched.country}
              label={"Country"}
            />
          </div>

          <TextField
            type="text"
            name="location"
            placeholder="Enter your location"
            value={formik.values.location}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.location}
            touched={formik.touched.location}
            label={"Home Address"}
          />

          {/* <div className="w-full flex flex-col gap-1">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <textarea
              name="description"
              id="description"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.description}
              placeholder="Describe yourself"
              className={`w-full border h-[124px] px-[15px] py-[14px] rounded-[8px] outline-none bg-[var(--secondary-bg)] ${
                formik.touched.description && formik.errors.description
                  ? "border-red-500"
                  : "border-[var(--secondary-bg)]"
              }`}
            ></textarea>
            {formik.touched.description && formik.errors.description ? (
              <div className="text-red-500 text-xs">
                {formik.errors.description}
              </div>
            ) : null}
          </div> */}

          <div className="pt-2 flex items-center justify-between">
            <Link
              to={redirect ? redirect : `/`}
              className="text-sm font-medium flex items-center gap-1 text-black"
            >
              Skip
            </Link>{" "}
            <div className="w-full max-w-[110px]">
              <Button type="submit" title="Save" isLoading={loading} />
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
