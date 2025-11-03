import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const OrderManagementHeader = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "buyer";
  const [activeHistoryTab, setActiveHistoryTab] = useState(initialTab);

  const handleTabChange = (tab) => {
    setActiveHistoryTab(tab);
    setSearchParams({ tab });
  };

  useEffect(() => {
    const urlTab = searchParams.get("tab");
    if (urlTab && urlTab !== activeHistoryTab) {
      setActiveHistoryTab(urlTab);
    }
  }, [searchParams]);

  return (
    <div className="w-full flex justify-between items-center">
      <div>
        <h1 className="text-[24px] lg:text-[32px] font-semibold leading-none text-white">
          Order Management
        </h1>
      </div>
      <div>
        <div className="w-[290px] max-w-[310px] h-[49px] rounded-[19px] px-1.5 py-1 productSearchInput grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => handleTabChange("seller")}
            className={`${
              activeHistoryTab === "seller"
                ? "bg-white rounded-l-[10px]"
                : "text-[var(--button-bg)]"
            } w-full text-center h-full font-medium text-sm`}
          >
            Seller History
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("buyer")}
            className={`${
              activeHistoryTab === "buyer"
                ? "bg-white rounded-r-[10px]"
                : "text-[var(--button-bg)]"
            } w-full text-center h-full font-medium text-sm`}
          >
            Buyer History
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderManagementHeader;
