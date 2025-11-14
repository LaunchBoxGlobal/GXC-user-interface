import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";

const AddProductDeliveryTypeSelector = ({ formik }) => {
  const { user } = useAppContext();

  useEffect(() => {
    if (!formik.values.deliveryType.includes("pickup")) {
      formik.setFieldValue("deliveryType", ["pickup"]);
    }
    if (!formik.values.customPickupAddress && user?.address) {
      formik.setFieldValue("customPickupAddress", user?.address);
    }
  }, [user]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Pickup Button */}
      <div className="flex flex-col gap-2">
        <label className="font-medium text-sm">Delivery Type</label>
        <button
          type="button"
          disabled
          className="px-4 w-full border rounded-[8px] text-sm font-medium transition-all h-[49px] bg-[var(--button-bg)] text-white border-[var(--secondary-bg)] cursor-default"
        >
          Pickup
        </button>
        {formik.touched.deliveryType && formik.errors.deliveryType && (
          <p className="text-red-500 text-xs">{formik.errors.deliveryType}</p>
        )}
      </div>

      {/* Pickup Address */}
      {/* <div className="w-full">
        <label className="font-medium text-sm mb-2 block">
          Self Pickup Address
        </label>

        <textarea
          name="customPickupAddress"
          placeholder="Enter pickup address"
          value={formik.values.customPickupAddress}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={`w-full bg-[var(--secondary-bg)] text-[#6D6D6D] px-[15px] py-[10px] rounded-[8px] outline-none min-h-[80px] resize-none ${
            formik.touched.customPickupAddress &&
            formik.errors.customPickupAddress
              ? "border border-red-500"
              : "border border-[var(--secondary-bg)]"
          }`}
        />
        {formik.touched.customPickupAddress &&
        formik.errors.customPickupAddress ? (
          <p className="text-red-500 text-xs mt-1">
            {formik.errors.customPickupAddress}
          </p>
        ) : null}
      </div> */}
    </div>
  );
};

export default AddProductDeliveryTypeSelector;
