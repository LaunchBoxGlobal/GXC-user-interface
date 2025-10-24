import React, { useState, useRef, useEffect } from "react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BiSolidPencil } from "react-icons/bi";

const ProductHeader = ({
  productDetails,
  user,
  setShowDeletePopup,
  navigate,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEdit = () => {
    navigate(`/edit-product?productId=${productDetails?.id}`);
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full flex items-start justify-between gap-4 relative">
      <div className="space-y-2 max-w-[70%]">
        {productDetails?.title && (
          <p className="font-semibold text-[24px] leading-none tracking-tight break-words">
            {productDetails?.title}
          </p>
        )}
        {productDetails?.deliveryMethod && (
          <p className="font-medium text-[#6D6D6D] text-xs">
            {productDetails?.deliveryMethod === "pickup"
              ? "Pickup"
              : productDetails?.deliveryMethod === "delivery"
              ? "Delivery"
              : "Pickup / Delivery"}
          </p>
        )}
      </div>

      {productDetails?.seller?.id === user?.id ? (
        <div className="relative" ref={dropdownRef}>
          <button type="button" onClick={toggleDropdown}>
            <HiOutlineDotsVertical className="text-xl" />
          </button>

          {isDropdownOpen && (
            <div className="w-[147px] h-[80px] bg-white rounded-[8px] flex flex-col items-start justify-evenly custom-shadow absolute top-7 right-0 z-10">
              <button
                type="button"
                onClick={handleEdit}
                className="flex items-center gap-2 px-5 hover:bg-gray-100 w-full py-2 rounded-t-[8px]"
              >
                <BiSolidPencil className="text-lg text-[var(--button-bg)]" />
                <span className="text-base leading-none">Edit</span>
              </button>
              <div className="w-full border" />
              <button
                type="button"
                onClick={() => setShowDeletePopup(true)}
                className="flex items-center gap-2 px-5 hover:bg-gray-100 w-full py-2 rounded-b-[8px]"
              >
                <img
                  src="/trash-icon-red.png"
                  alt="trash-icon-red"
                  className="w-[13px] h-[16px]"
                />
                <span className="text-base leading-none text-red-500">
                  Delete
                </span>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <p className="text-sm font-medium text-[#6D6D6D]">Price</p>
          <p className="text-[24px] font-semibold text-[var(--button-bg)] leading-[1.3]">
            ${productDetails?.price}
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductHeader;
