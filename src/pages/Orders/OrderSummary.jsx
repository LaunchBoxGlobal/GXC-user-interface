import React from "react";

const OrderSummary = () => {
  return (
    <div className="bg-white rounded-[18px] w-full">
      <h2 className="text-[24px] font-semibold leading-none px-5 pt-5 lg:pt-7">
        Order Summary
      </h2>
      <div className="w-full border my-5" />
      <div className="w-full px-5 pb-5">
        <div className="w-full flex items-center justify-between">
          <p className="text-base text-gray-600">Subtotal</p>
          <p className="text-base text-gray-600">$49.99</p>
        </div>
        <div className="w-full border my-3" />
        <div className="w-full flex items-center justify-between">
          <p className="text-base text-gray-600">Products</p>
          <p className="text-base text-gray-600">4</p>
        </div>
        <div className="w-full border my-3" />
        <div className="w-full flex items-center justify-between">
          <p className="text-base text-gray-600">Platform Fee (2%)</p>
          <p className="text-base text-gray-600">$15</p>
        </div>
        <div className="w-full border my-3" />
        <div className="w-full flex items-center justify-between">
          <p className="text-base text-[var(--button-bg)] font-semibold">
            Total
          </p>
          <p className="text-base text-[var(--button-bg)] font-semibold">
            $948.00
          </p>
        </div>

        <div className="w-full mt-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="w-full bg-[#DEDEDE] rounded-[12px] h-[48px] text-center font-medium"
          >
            Cancel Order
          </button>
          <button
            type="button"
            className="w-full bg-[var(--button-bg)] text-white rounded-[12px] h-[48px] text-center font-medium"
          >
            Mark As Received
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
