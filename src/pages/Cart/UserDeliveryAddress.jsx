import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import Cookies from "js-cookie";

const UserDeliveryAddress = ({
  userNewDeliveryAddress,
  toggleAddAddressModal,
  selectedAddress,
  setSelectedAddress,
  toggleEditAddressModal,
  openEditAddressModal,
}) => {
  const { user } = useAppContext();

  useEffect(() => {
    const savedAddress = Cookies.get("userSelectedDeliveryAddress");
    if (savedAddress) {
      setSelectedAddress(JSON.parse(savedAddress));
    }
  }, [userNewDeliveryAddress]);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    Cookies.set("userSelectedDeliveryAddress", JSON.stringify(address));
  };

  return (
    <div className="w-full">
      <div className="w-full border my-5" />
      <div className="w-full flex items-center justify-between gap-3">
        <p className="font-semibold leading-none">Delivery Address</p>
        {!userNewDeliveryAddress && (
          <button
            type="button"
            onClick={toggleAddAddressModal}
            className="text-[15px] font-medium leading-none text-[var(--button-bg)]"
          >
            + Add new delivery address
          </button>
        )}
      </div>

      {/* ✅ Default user address */}
      {user && user?.address && (
        <div
          className={`w-full flex items-center justify-between h-[46px] bg-[#2B3743]/20 mt-2 rounded-[12px] px-3 border 
            ${
              selectedAddress?.type === "default"
                ? "border-[var(--button-bg)]"
                : "border-transparent"
            }`}
        >
          <div className="w-full max-w-[90%]">
            <p>
              {user?.address} {user?.city} {user?.state} {user?.zipcode}{" "}
              {user?.country}
            </p>
          </div>
          <div className="h-full flex items-center justify-end">
            <input
              type="radio"
              name="userDeliveryAddress"
              checked={selectedAddress?.type === "default"}
              onChange={() =>
                handleSelectAddress({
                  type: "default",
                  address: user?.address,
                  city: user?.city,
                  state: user?.state,
                  zipcode: user?.zipcode,
                  country: user?.country,
                })
              }
              className="w-[16px] h-[16px] accent-[var(--button-bg)]"
            />
          </div>
        </div>
      )}

      {/* ✅ New address (if exists) */}

      {userNewDeliveryAddress && (
        <>
          <div className="w-full mt-3 flex justify-end">
            <button
              type="button"
              onClick={toggleEditAddressModal}
              className="text-[15px] font-medium leading-none text-[var(--button-bg)]"
            >
              + Edit delivery address
            </button>
          </div>

          <div
            className={`w-full flex items-center justify-between h-[46px] bg-[#2B3743]/20 mt-2 rounded-[12px] px-3 border 
            ${
              selectedAddress?.type === "new"
                ? "border-[var(--button-bg)]"
                : "border-transparent"
            }`}
          >
            <div className="w-full max-w-[90%]">
              <label className="w-full break-words cursor-pointer">
                {userNewDeliveryAddress?.location},{" "}
                {userNewDeliveryAddress?.city} {userNewDeliveryAddress?.state}{" "}
                {userNewDeliveryAddress?.zipcode}{" "}
                {userNewDeliveryAddress?.country}
              </label>
            </div>
            <div className="h-full flex items-center justify-end">
              <input
                type="radio"
                name="userDeliveryAddress"
                checked={selectedAddress?.type === "new"}
                onChange={() =>
                  handleSelectAddress({
                    type: "new",
                    ...userNewDeliveryAddress,
                  })
                }
                className="w-[16px] h-[16px] accent-[var(--button-bg)]"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UserDeliveryAddress;
