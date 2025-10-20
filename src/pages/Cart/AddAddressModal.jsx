import { enqueueSnackbar } from "notistack";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  CountrySelect,
  StateSelect,
  CitySelect,
} from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import TextField from "../../components/Common/TextField";
import Cookies from "js-cookie";
import { useState } from "react";

const AddAddressModal = ({
  openAddAddressModal,
  toggleAddAddressModal,
  setUserNewDeliveryAddress,
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      location: "",
      zipcode: "",
      city: "",
      state: "",
      country: "",
      countryId: "",
      stateId: "",
    },
    validationSchema: Yup.object({
      location: Yup.string()
        .min(11, `Address cannot be less than 11 characters`)
        .max(150, `Address can not be more than 150 characters`)
        .required("Please enter your location"),
      zipcode: Yup.string()
        .matches(/^[A-Za-z0-9\- ]{4,10}$/, "Please enter a valid zip code")
        .required("Enter your zip code"),
      city: Yup.string().required("Enter your city"),
      state: Yup.string().required("Enter your state"),
      country: Yup.string().required("Enter your country"),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      console.log(values);
      const userAddress = {
        country: values.country,
        state: values.state,
        city: values.city,
        zipcode: values.zipcode,
        location: values.location,
      };

      Cookies.set("newDeliveryAddress", JSON.stringify(userAddress));
      setUserNewDeliveryAddress(userAddress);
      resetForm();
      enqueueSnackbar("Address added successfully!", {
        variant: "success",
      });
      toggleAddAddressModal();
    },
  });
  return (
    openAddAddressModal && (
      <div className="w-full h-screen fixed inset-0 z-50 bg-[rgba(0,0,0,0.4)] flex items-center justify-center padding-x">
        <form
          onSubmit={formik.handleSubmit}
          className="w-full bg-white max-w-[470px] rounded-[12px] p-7"
        >
          <h2 className="text-[24px] font-semibold leading-none">
            Add New Address
          </h2>
          <div className="w-full border my-4" />

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

          <div className="grid grid-cols-2 gap-4 mt-5">
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

          <div className="w-full mt-5">
            <TextField
              type="text"
              name="location"
              placeholder="Enter suite / apartment / street"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.location}
              touched={formik.touched.location}
              label="Suite / Apartment / Street"
            />
          </div>

          <div className="w-full mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={toggleAddAddressModal}
              className="w-full bg-[var(--secondary-bg)] text-black h-[49px] rounded-[8px] text-center font-medium"
            >
              Cancel
            </button>
            <button type="submit" className="button">
              Add
            </button>
          </div>
        </form>
      </div>
    )
  );
};

export default AddAddressModal;
