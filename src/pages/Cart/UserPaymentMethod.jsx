import React, { useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import Cookies from "js-cookie";

const UserPaymentMethod = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}) => {
  const { user } = useAppContext();

  useEffect(() => {
    const savedPaymentMethod = Cookies.get("userSelectedPaymentMethod");
    if (savedPaymentMethod) {
      setSelectedPaymentMethod(JSON.parse(savedPaymentMethod));
    }
  }, []);

  const handleSelectPaymentMethod = (method) => {
    setSelectedPaymentMethod(method);
    Cookies.set("userSelectedPaymentMethod", JSON.stringify(method));
  };
  return (
    <div className="w-full">
      <div className="w-full flex items-center justify-between gap-3">
        <p className="font-semibold leading-none">Payment Method</p>
        <button
          type="button"
          className="text-[15px] font-medium leading-none text-[var(--button-bg)]"
        >
          + Add new payment method
        </button>
      </div>
      <div className="w-full flex items-center justify-between h-[46px] bg-[#2B3743]/20 mt-2 rounded-[12px] px-3 border border-[var(--button-bg)]">
        <div className="w-full max-w-[90%] flex items-center gap-3">
          <img
            src="/stripe-icon.png"
            alt="stipe icon"
            className="w-[34px] h-[24px]"
          />
          <p className="text-sm">**** **** **** 8941</p>
        </div>
        <div className="h-full flex items-center justify-end">
          <input
            type="radio"
            name="userPaymentMethod"
            checked={selectedPaymentMethod?.id === "stripe-8941"}
            onChange={() =>
              handleSelectPaymentMethod({
                id: "stripe-8941",
                brand: "Stripe",
                last4: "8941",
                type: "card",
              })
            }
            className="w-[16px] h-[16px] accent-[var(--button-bg)]"
          />
        </div>
      </div>
      {/* {user && user?.address && (
        <div className="w-full flex items-center justify-between h-[46px] bg-[#2B3743]/20 mt-2 rounded-[12px] px-3 border border-[var(--button-bg)]">
          <div className="w-full max-w-[90%]">
            <p>
              {user?.address && user?.address} {user?.city && user?.city}{" "}
              {user?.state && user?.state} {user?.zipcode && user?.zipcode}{" "}
              {user?.country && user?.country}
            </p>
          </div>
          <div className="h-full flex items-center justify-end">
            <input type="radio" name="" id="" className="w-[16px] h-[16px]" />
          </div>
        </div>
      )} */}
    </div>
  );
};

export default UserPaymentMethod;
