const AddProductPickupAddressField = ({ formik, fieldName, label }) => {
  const isCommunityPickupAddress = fieldName === "communityPickupAddress";
  return (
    <div className="w-full">
      <label className="font-medium text-sm mb-2 block">{label}</label>

      <textarea
        name={fieldName}
        value={formik.values[fieldName]}
        placeholder="Enter pickup address"
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        disabled={isCommunityPickupAddress}
        className={`w-full bg-[var(--secondary-bg)] text-[#6D6D6D] px-[15px] py-[10px] rounded-[8px] outline-none h-[49px] resize-none disabled:cursor-not-allowed ${
          formik.touched[fieldName] && formik.errors[fieldName]
            ? "border border-red-500"
            : "border border-[var(--secondary-bg)]"
        }`}
      />

      {formik.touched[fieldName] && formik.errors[fieldName] && (
        <p className="text-red-500 text-xs mt-1">{formik.errors[fieldName]}</p>
      )}
    </div>
  );
};

export default AddProductPickupAddressField;
