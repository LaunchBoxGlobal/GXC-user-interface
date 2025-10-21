import React from "react";
import { HiArrowLeft } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import { FaLocationDot } from "react-icons/fa6";

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-28">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="w-full max-w-[48px] flex items-center justify-between text-sm text-white"
      >
        <HiArrowLeft />
        Back
      </button>

      <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-5 grid grid-cols-3 gap-5">
        <div className="w-full bg-white rounded-[18px] relative p-5 min-h-[70vh] col-span-2">
          <div className="w-full flex items-star flex-col justify-start relative">
            <div className="w-full">
              <p className="font-semibold text-[20px] leading-none tracking-tight break-words">
                Order Details
              </p>
            </div>
            <div className="w-full border my-4" />
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-gray-600">Order ID</p>
              <p className="text-base text-gray-600">AB26413</p>
            </div>
            <div className="w-full border my-4" />
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-gray-600">Order Placed</p>
              <p className="text-base text-gray-600">21 Jan, 2024</p>
            </div>
            <div className="w-full border my-4" />
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-gray-600">Order Status</p>
              <p className="text-base text-[#FF7700]">In Progress</p>
            </div>
            <div className="w-full border my-4" />
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-gray-600">Delivery Type</p>
              <p className="text-base text-gray-600">Deliver At Home</p>
            </div>
            <div className="w-full border my-4" />
            <div className="w-full space-y-2">
              <p className="text-base text-gray-800 font-semibold">
                Delivery Address
              </p>
              <div className="w-full flex items-center gap-2">
                <FaLocationDot className="text-lg text-[var(--button-bg)]" />
                <p className="text-base text-gray-600">
                  Unit 500, Montford Court, Montford Street, Salford, M50 2QP -
                  123456
                </p>
              </div>
            </div>
            <div className="w-full border my-4" />
            <div className="w-full flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="">
                  <img
                    src="/denim-jacket-image.png"
                    alt="denim jacket"
                    className="min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px]"
                  />
                </div>
                <div className="flex flex-col items-start gap-1 justify-center">
                  <p className="font-semibold leading-none">Product Name</p>
                  <p className="text-gray-600">Delivery</p>
                </div>
              </div>
              <div className="max-w-[50px] flex flex-col items-start gap-1 justify-center">
                <Link to={`/`}>
                  <div className="w-[49px] h-[49px] rounded-[12px] flex items-center justify-center bg-[var(--button-bg)]">
                    <img
                      src="/right-arrow-icon.png"
                      alt="right-arrow-icon"
                      className="w-[7px] h-[14px]"
                    />
                  </div>
                </Link>
              </div>
            </div>
            <div className="w-full border my-4" />
            <div className="w-full flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="">
                  <img
                    src="/denim-jacket-image.png"
                    alt="denim jacket"
                    className="min-w-[80px] min-h-[80px] max-w-[80px] max-h-[80px]"
                  />
                </div>
                <div className="flex flex-col items-start gap-1 justify-center">
                  <p className="font-semibold leading-none">Product Name</p>
                  <p className="text-gray-600">Delivery</p>
                </div>
              </div>
              <div className="max-w-[50px] flex flex-col items-start gap-1 justify-center">
                <Link to={`/`}>
                  <div className="w-[49px] h-[49px] rounded-[12px] flex items-center justify-center bg-[var(--button-bg)]">
                    <img
                      src="/right-arrow-icon.png"
                      alt="right-arrow-icon"
                      className="w-[7px] h-[14px]"
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full col-span-1">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
