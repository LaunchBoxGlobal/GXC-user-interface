import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { FiPlus } from "react-icons/fi";
import TextField from "../../components/Common/TextField";
import { useFormik } from "formik";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import * as Yup from "yup";
import { getToken } from "../../utils/getToken";
import PhoneNumberField from "../../components/Common/PhoneNumberField";
import { enqueueSnackbar } from "notistack";

const EditProfile = () => {
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();
  const { user, setUser } = useAppContext();

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setUser(res?.data?.data?.user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        switch (status) {
          case 401:
            console.error("Unauthorized: Token expired or invalid.");
            localStorage.removeItem("token");
            navigate("/login");
            break;

          case 403:
            console.error("Forbidden: You do not have access.");
            break;

          case 404:
            console.error("Profile not found.");
            break;

          case 500:
            console.error("Server error. Please try again later.");
            break;

          default:
            console.error(
              `Unexpected error: ${status} - ${
                error.response?.data?.message || error.message
              }`
            );
        }
      } else {
        console.error("Network or unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user?.profilePicture) {
      setPreview(user.profilePictureUrl);
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      formik.setFieldValue("profileImage", file);
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      address: user?.address || "",
      phoneNumber: user?.phone || "",
      profileImage: null,
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
      address: Yup.string()
        .min(15, "Address must be atleast 15 characters")
        .max(50, "Address cannot contain more than 50 characters")
        .required("Address is required"),
      phoneNumber: Yup.string()
        .matches(/^\d{11}$/, "Phone number must be exactly 11 digits")
        .required("Phone number is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      profileImage: Yup.mixed().nullable(),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const profileRes = await axios.put(
          `${BASE_URL}/auth/profile`,
          {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phoneNumber,
            address: values.address,
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
          console.log("Image uploaded:", imageRes.data);
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
          // alert("Profile Updated Successfully!");
          navigate("/profile");
        }
      } catch (error) {
        console.error("Update profile error:", error.response?.data);
        if (error?.response?.status === 401) {
          enqueueSnackbar(error?.response?.data?.message || error?.message, {
            variant: "error",
          });
          // alert("Session expired, please login again.");
        } else {
          enqueueSnackbar(error?.response?.data?.message || error?.message, {
            variant: "error",
          });
        }
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
        <div className="w-full flex items-center justify-start gap-4">
          <label
            htmlFor="profileImage"
            className="bg-[var(--secondary-bg)] text-slate-500 font-semibold text-base w-[100px] h-[100px] rounded-full flex items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed overflow-hidden"
          >
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <FiPlus className="text-3xl" />
            )}
            <input
              type="file"
              id="profileImage"
              name="profileImage"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <div className="">
            <label
              htmlFor="profileImage"
              className={`underline text-[15px] font-medium cursor-pointer text-[var(--primary-blue)]`}
            >
              Change Profile
            </label>
            {/* {error && (
                <span className="text-xl text-red-500 font-medium">*</span>
              )} */}
          </div>
        </div>
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
          />
        </div>

        <div className="w-full">
          <label htmlFor="address" className="font-medium text-sm">
            Home Address
          </label>
          <TextField
            type="text"
            name="address"
            placeholder=""
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.address}
            touched={formik.touched.address}
          />
        </div>

        <div className="w-full">
          <button type="submit" className="button">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditProfile;
