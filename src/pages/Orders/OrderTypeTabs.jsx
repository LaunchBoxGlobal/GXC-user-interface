import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const tabs = [
  { title: "All", tab: "all" },
  { title: "In Progress", tab: "in_progress" },
  { title: "Completed", tab: "completed" },
  { title: "Cancelled", tab: "cancelled" },
];

const OrderTypeTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("orderType") || "all";
  const [activeHistoryTab, setActiveHistoryTab] = useState(initialTab);

  const handleTabChange = (tab) => {
    setActiveHistoryTab(tab);

    // ✅ Clone existing params and update only `orderType`
    const newParams = new URLSearchParams(searchParams);
    newParams.set("orderType", tab);
    setSearchParams(newParams);
  };

  useEffect(() => {
    const urlTab = searchParams.get("orderType");
    if (urlTab && urlTab !== activeHistoryTab) {
      setActiveHistoryTab(urlTab);
    }
  }, [searchParams]);

  return (
    <div className="w-full flex items-center gap-3">
      {tabs.map((btn) => (
        <button
          key={btn.tab}
          type="button"
          onClick={() => handleTabChange(btn.tab)}
          className={`h-[36px] ${
            activeHistoryTab === btn.tab
              ? "bg-[var(--button-bg)] text-white"
              : "bg-[var(--secondary-bg)]"
          } px-5 rounded-xl text-sm transition-all`}
        >
          {btn.title}
        </button>
      ))}
    </div>
  );
};

export default OrderTypeTabs;
