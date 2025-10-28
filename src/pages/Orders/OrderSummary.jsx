import React from "react";

const OrderSummary = ({ orderSummary }) => {
  return (
    <div className="bg-white rounded-[18px] w-full">
      <h2 className="text-[24px] font-semibold leading-none px-5 pt-5 lg:pt-7">
        Order Summary
      </h2>
      <div className="w-full border my-5" />
      <div className="w-full px-5 pb-5">
        <div className="w-full flex items-center justify-between">
          <p className="text-base text-gray-600">Subtotal</p>
          <p className="text-base text-gray-600">
            ${orderSummary?.totalAmount.toFixed(2)}
          </p>
        </div>
        <div className="w-full border my-3" />
        <div className="w-full flex items-center justify-between">
          <p className="text-base text-gray-600">Products</p>
          <p className="text-base text-gray-600">
            {orderSummary?.items?.length}
          </p>
        </div>
        <div className="w-full border my-3" />
        <div className="w-full flex items-center justify-between">
          <p className="text-base text-gray-600">Platform Fee (2%)</p>
          <p className="text-base text-gray-600">
            $
            {orderSummary?.platformFee > 0
              ? orderSummary?.platformFeetoFixed(2)
              : orderSummary?.platformFee}
          </p>
        </div>
        <div className="w-full border my-3" />
        <div className="w-full flex items-center justify-between">
          <p className="text-base text-[var(--button-bg)] font-semibold">
            Total
          </p>
          <p className="text-base text-[var(--button-bg)] font-semibold">
            ${orderSummary?.totalAmount.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
