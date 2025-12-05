import { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { useUser } from "../../context/userContext";

const AddProductDeliveryTypeSelector = ({ formik }) => {
  const { user } = useAppContext();
  const { selectedCommunity } = useUser();

  const userAddress = [
    user?.address,
    user?.city,
    user?.state,
    user?.zipcode,
    user?.country,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const communityAddress = [
    selectedCommunity?.address,
    selectedCommunity?.city,
    selectedCommunity?.state,
    selectedCommunity?.zipcode,
    selectedCommunity?.country,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  // Initialize on mount
  useEffect(() => {
    if (formik.values.deliveryType.length === 0) {
      formik.setFieldValue("deliveryType", ["self"]);
    }

    if (!formik.values.selfPickupAddress && userAddress) {
      formik.setFieldValue("selfPickupAddress", userAddress);
    }
  }, [user]);

  const toggleType = (type) => {
    let current = [...formik.values.deliveryType];

    if (current.includes(type)) {
      current = current.filter((t) => t !== type);
    } else {
      current.push(type);
    }

    if (current.length === 0) {
      current = ["self"]; // always keep at least one selected
    }

    formik.setFieldValue("deliveryType", current);

    if (current.includes("self")) {
      formik.setFieldValue("selfPickupAddress", userAddress);
    }

    if (current.includes("community")) {
      formik.setFieldValue("communityPickupAddress", communityAddress);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="font-medium text-sm">Delivery Type</label>

      <div className="grid grid-cols-2 gap-3">
        {/* Self Pickup */}
        <button
          type="button"
          onClick={() => toggleType("self")}
          className={`px-4 w-full h-[49px] rounded-[8px] font-medium text-sm transition-all 
            ${
              formik.values.deliveryType.includes("self")
                ? "bg-[var(--button-bg)] text-white"
                : "bg-[#f5f5f5] text-black"
            }`}
        >
          Self Pickup
        </button>

        {/* Community Pickup */}
        <button
          type="button"
          onClick={() => toggleType("community")}
          className={`px-4 w-full h-[49px] rounded-[8px] font-medium text-sm transition-all 
            ${
              formik.values.deliveryType.includes("community")
                ? "bg-[var(--button-bg)] text-white"
                : "bg-[#f5f5f5] text-black"
            }`}
        >
          Community Pickup
        </button>
      </div>

      {formik.touched.deliveryType && formik.errors.deliveryType && (
        <p className="text-red-500 text-xs">{formik.errors.deliveryType}</p>
      )}
    </div>
  );
};

export default AddProductDeliveryTypeSelector;
