import React from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const AddProductPage = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-20">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="w-full max-w-[48px] flex items-center justify-between text-sm text-white"
      >
        <HiArrowLeft />
        Back
      </button>
      <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-2">
        <div className="w-full bg-white rounded-[18px] relative p-5">
          <div className="w-full">
            <div className="w-full"></div>
            <div className="w-full pt-3">
              <div className="w-full flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="font-semibold text-[20px] leading-none tracking-tight">
                    Add Product
                  </p>
                  <p className="font-medium text-[#6D6D6D] text-xs">
                    Pickup/Delivery
                  </p>
                </div>
              </div>
              <div className="w-full border my-5" />

              <div className="w-full space-y-3">
                <p className="text-sm font-semibold">Description</p>
                <p className="text-sm font-normal leading-[1.3]">
                  Xbox Series X is Microsoft's flagship gaming console, offering
                  unparalleled performance and speed. With its powerful AMD Zen
                  2 processor and RDNA 2 graphics architecture, it delivers
                  stunning 4K visuals and supports up to 120 frames per second.
                  The Series X features a 1TB SSD for rapid load times and
                  seamless gameplay, while its backward compatibility allows
                  access.
                </p>
              </div>

              <div className="w-full border my-5" />

              <div className="w-full">
                <p className="text-sm font-medium text-[#6D6D6D]">Price</p>
                <p className="text-[24px] font-semibold text-[var(--button-bg)] leading-[1.3]">
                  $199.00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
