import React from "react";

const ProductSellerInfo = ({ productDetails }) => {
  return (
    <>
      {productDetails?.pickupAddress?.address && (
        <>
          <div className="w-full border my-5" />
          <div className="w-full space-y-3">
            <p className="text-sm font-semibold">Pickup Address</p>
            <p className="text-sm font-normal break-words">
              <span className="font-medium">Address:</span>{" "}
              {productDetails?.pickupAddress?.address}
            </p>
            <p className="text-sm font-normal">
              <span className="font-medium">City:</span>{" "}
              {productDetails?.pickupAddress?.city}
            </p>
            <p className="text-sm font-normal">
              <span className="font-medium">State:</span>{" "}
              {productDetails?.pickupAddress?.state}
            </p>
          </div>
        </>
      )}
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
