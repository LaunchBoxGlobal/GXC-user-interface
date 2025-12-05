import { FaLocationDot } from "react-icons/fa6";

const ProductSellerInfo = ({ productDetails }) => {
  return (
    <>
      {/* {productDetails?.pickupAddress?.address && ( */}
      <>
        {(productDetails?.deliveryMethod === "pickup" ||
          productDetails?.deliveryMethod === "both") &&
          productDetails?.pickupAddress?.address && (
            <>
              <div className="w-full border my-5" />
              <div className="w-full space-y-3 overflow-hidden">
                <p className="text-sm font-semibold">Pickup Address</p>
                <p className="text-sm font-normal overflow-hidden flex items-start gap-2 w-full">
                  <FaLocationDot className="min-w-3 text-lg leading-none relative top-0.5" />
                  <span className="break-words">
                    {productDetails?.pickupAddress?.address}
                  </span>
                </p>
              </div>
            </>
          )}

        {(productDetails?.deliveryMethod === "delivery" ||
          productDetails?.deliveryMethod === "both") &&
          productDetails?.communityPickupAddress?.address && (
            <>
              <div className="w-full border my-5" />
              <div className="w-full space-y-3 overflow-hidden">
                <p className="text-sm font-semibold">
                  Community Pickup Address
                </p>
                <p className="text-sm font-normal overflow-hidden flex items-start gap-2 w-full">
                  <FaLocationDot className="min-w-3 text-lg leading-none relative top-0.5" />
                  <span className="break-words">
                    {productDetails?.communityPickupAddress?.address}
                  </span>
                </p>
              </div>
            </>
          )}
      </>
      {/* )} */}
      <div className="w-full border my-5" />
      <div className="w-full">
        <p className="text-sm font-medium text-[#6D6D6D]">Price</p>
        <p className="text-[24px] font-semibold text-[var(--button-bg)] leading-[1.3]">
          ${productDetails?.price}
        </p>
      </div>
    </>
  );
};

export default ProductSellerInfo;
