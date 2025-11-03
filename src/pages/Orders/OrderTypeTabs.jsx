import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const tabs = [
  { title: "All", tab: "all" },
  { title: "In Progress", tab: "in_progress" },
  { title: "Completed", tab: "delivered" },
  { title: "Cancelled", tab: "cancelled" },
];

export const sellerTabs = [
  { title: "All", tab: "pending,in_progress,ready,completed,cancelled" },
  { title: "In Progress", tab: "pending,in_progress" },
  { title: "Completed", tab: "completed" },
  { title: "Cancelled", tab: "cancelled" },
];

const OrderTypeTabs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab");

  const initialTab =
    searchParams.get("orderType") ||
    (activeTab === "seller"
      ? "pending,in_progress,ready,completed,cancelled"
      : "all");

  const [activeHistoryTab, setActiveHistoryTab] = useState(initialTab);

  const handleTabChange = (tab) => {
    setActiveHistoryTab(tab);
    const newParams = new URLSearchParams(searchParams);
    newParams.set("orderType", tab);
    setSearchParams(newParams);
  };

  useEffect(() => {
    const urlTab = searchParams.get("orderType");
    if (!urlTab) {
      // if no orderType in URL, set default based on user type
      const defaultTab =
        activeTab === "seller"
          ? "pending,in_progress,ready,completed,cancelled"
          : "all";
      const newParams = new URLSearchParams(searchParams);
      newParams.set("orderType", defaultTab);
      setSearchParams(newParams);
      setActiveHistoryTab(defaultTab);
    } else if (urlTab !== activeHistoryTab) {
      setActiveHistoryTab(urlTab);
    }
  }, [searchParams, activeTab]);

  const currentTabs = activeTab === "seller" ? sellerTabs : tabs;

  return (
    <div className="w-full flex items-center gap-3">
      {currentTabs.map((btn) => (
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
