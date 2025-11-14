const AddProductPickupAddressField = ({ formik }) => {
  return (
    <div className="w-full">
      <label className="font-medium text-sm mb-2 block">
        Self Pickup Address
      </label>
      <textarea
        name="customPickupAddress"
        placeholder="Enter pickup address"
        value={formik.values.customPickupAddress}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className={`w-full bg-[var(--secondary-bg)] text-[#6D6D6D] px-[15px] py-[10px] rounded-[8px] outline-none h-[49px] resize-none ${
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
    </div>
  );
};

export default AddProductPickupAddressField;
