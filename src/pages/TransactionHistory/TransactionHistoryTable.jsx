import React from "react";
import { LuSearch } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import TransactionsTable from "./TransactionsTable";
import Pagination from "../../components/Forms/Pagination";

const TransactionHistoryTable = ({
  sellerType,
  setSellerType,
  transactions,
  searchTerm,
  setSearchTerm,
  loading,
  error,
  page,
  pagination,
}) => {
  return (
    <div className="w-full relative mt-6">
      {/* Top Section (Title + Tabs + Search) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
        <h3 className="text-[24px] lg:text-[32px] font-semibold leading-none">
          Transaction History
        </h3>

        <div className="w-full flex justify-end flex-wrap gap-5">
          <div className="w-full max-w-[210px] rounded-[9px] h-[49px] grid grid-cols-2 bg-white custom-shadow p-1">
            <button
              type="button"
              onClick={() => setSellerType("seller")}
              className={`w-full h-full ${
                sellerType === "seller"
                  ? "bg-[var(--button-bg)] text-white"
                  : "bg-white text-[var(--button-bg)]"
              } font-medium text-sm rounded-[9px]`}
            >
              Seller
            </button>
            <button
              type="button"
              onClick={() => setSellerType("buyer")}
              className={`w-full h-full ${
                sellerType === "buyer"
                  ? "bg-[var(--button-bg)] text-white"
                  : "bg-white text-[var(--button-bg)]"
              } font-medium text-sm rounded-[9px]`}
            >
              Buyer
            </button>
          </div>

          {/* Search */}
          <div className="w-full md:max-w-[252px]">
            <div className="h-[49px] pl-[15px] pr-[10px] rounded-[8px] bg-white custom-shadow flex items-center justify-start gap-2">
              <LuSearch className="text-xl text-[var(--secondary-color)]" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full outline-none border-none"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="bg-gray-100 w-4 h-4 rounded-full"
                >
                  <IoClose className="text-gray-500 text-sm" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <TransactionsTable
        loading={loading}
        error={error}
        transactions={transactions}
        sellerType={sellerType}
      />

      <Pagination pagination={pagination} page={page} />
    </div>
  );
};

export default React.memo(TransactionHistoryTable);
