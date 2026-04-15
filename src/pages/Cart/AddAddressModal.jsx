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
import { useTranslation } from "react-i18next";

const AddAddressModal = ({
  openAddAddressModal,
  toggleAddAddressModal,
  setUserNewDeliveryAddress,
}) => {
  const { t } = useTranslation("cart");
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
        .min(11, t(`errors.minLocation`))
        .max(150, t(`errors.maxLocation`))
        .required(t(`errors.locationRequired`)),
      zipcode: Yup.string()
        .matches(/^[A-Za-z0-9\- ]{4,10}$/, t(`errors.enterValidZipcode`))
        .required(t(`errors.zipCodeIsRequired`)),
      city: Yup.string().required(t(`errors.city`)),
      state: Yup.string().required(t(`errors.state`)),
      country: Yup.string().required(t(`errors.country`)),
    }),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { resetForm }) => {
      console.log(values);
      const userAddress = {
        country: values.country.trim(),
        state: values.state.trim(),
        city: values.city.trim(),
        zipcode: values.zipcode.trim(),
        location: values.location.trim(),
        countryId: values.countryId,
        stateId: values.stateId,
      };

      Cookies.set("newDeliveryAddress", JSON.stringify(userAddress));
      setUserNewDeliveryAddress(userAddress);
      resetForm();
      enqueueSnackbar(t("Address added successfully!"), {
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
            {t(`addNewAddress`)}
          </h2>
          <div className="w-full border my-4" />

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full flex flex-col gap-1">
              <label className="text-sm font-medium">{t(`form.country`)}</label>
              <CountrySelect
                containerClassName="w-full"
                inputClassName={`w-full border h-[39px] px-[15px] rounded-[8px] outline-none ${
                  formik.touched.country && formik.errors.country
                    ? "border-red-500"
                    : "border-gray-200"
                }`}
                defaultValue={
                  formik.values.country
                    ? {
                        name: formik.values.country,
                        id: formik.values.countryId,
                      }
                    : null
                }
                placeHolder={t(`form.selectCountry`)}
                onChange={(val) => {
                  formik.setFieldValue("country", val.name);
                  formik.setFieldValue("countryId", Number(val.id));
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
              <label className="text-sm font-medium">{t(`form.state`)}</label>
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
                placeHolder={t(`form.selectState`)}
                defaultValue={
                  formik.values.state
                    ? { name: formik.values.state, id: formik.values.stateId }
                    : null
                }
                onChange={(val) => {
                  formik.setFieldValue("state", val.name);
                  formik.setFieldValue("stateId", Number(val.id));
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
              <label className="text-sm font-medium">{t(`form.city`)}</label>
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
                placeHolder={t(`form.selectCity`)}
                onChange={(val) => formik.setFieldValue("city", val.name)}
              />
              {formik.touched.city && formik.errors.city && (
                <p className="text-red-500 text-xs">{formik.errors.city}</p>
              )}
            </div>

            <TextField
              type="text"
              name="zipcode"
              placeholder={t(`form.enterZipCode`)}
              value={formik.values.zipcode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.zipcode}
              touched={formik.touched.zipcode}
              label={t(`form.zipCode`)}
            />
          </div>

          <div className="w-full mt-5">
            <TextField
              type="text"
              name="location"
              placeholder={t(`form.locationPlaceholder`)}
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.location}
              touched={formik.touched.location}
              label={t(`form.locationLabel`)}
            />
          </div>

          <div className="w-full mt-6 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={toggleAddAddressModal}
              className="w-full bg-[var(--secondary-bg)] text-black h-[49px] rounded-[8px] text-center font-medium"
            >
              {t(`buttons.cancel`)}
            </button>
            <button type="submit" className="button">
              {t(`buttons.add`)}
            </button>
          </div>
        </form>
      </div>
    )
  );
};

export default AddAddressModal;
