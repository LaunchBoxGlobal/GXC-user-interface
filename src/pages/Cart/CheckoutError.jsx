import React from "react";

const CheckoutError = ({ error, fetchCartProducts, t }) => {
  return (
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-20">
      <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-2">
        <div className="w-full rounded-[18px] relative min-h-[60vh] bg-white flex flex-col items-center justify-center gap-4">
          <p className="text-lg font-semibold text-gray-800 text-center max-w-md">
            {error}
          </p>
          <button
            onClick={fetchCartProducts}
            className="bg-[var(--primary-color)] text-white px-5 py-2 rounded-lg hover:opacity-90 transition"
          >
            {t(`buttons.retry`)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutError;
