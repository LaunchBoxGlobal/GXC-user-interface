import { useAppContext } from "../../context/AppContext";

const EditProductDeliveryTypeSelector = ({ formik, product }) => {
  const { user } = useAppContext();

  const userAddress = [
    user?.address,
    user?.city,
    user?.state,
    user?.zipcode,
    user?.country,
  ]
    .filter(Boolean)
    .join(" ");

  const toggleType = (type) => {
    let current = [...formik?.values?.deliveryType];

    if (current.includes(type)) {
      current = current.filter((t) => t !== type);
    } else {
      current.push(type);
    }

    if (current.length === 0) current = ["self"];

    formik.setFieldValue("deliveryType", current);

    if (current.includes("self")) {
      formik.setFieldValue(
        "selfPickupAddress",
        product?.pickupAddress?.address || userAddress
      );
    }

    if (current.includes("community")) {
      formik.setFieldValue(
        "communityPickupAddress",
        product?.communityPickupAddress?.address
      );
    }
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <label className="font-medium text-sm">Delivery Type</label>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => toggleType("self")}
          className={`px-4 h-[49px] rounded-[8px] ${
            formik?.values?.deliveryType?.includes("self")
              ? "bg-[var(--button-bg)] text-white"
              : "bg-[#f5f5f5]"
          }`}
        >
          Self Pickup
        </button>

        <button
          type="button"
          onClick={() => toggleType("community")}
          className={`px-4 h-[49px] rounded-[8px] ${
            formik?.values?.deliveryType?.includes("community")
              ? "bg-[var(--button-bg)] text-white"
              : "bg-[#f5f5f5]"
          }`}
        >
          Community Pickup
        </button>
      </div>
    </div>
  );
};

export default EditProductDeliveryTypeSelector;
