import React from "react";
import Loader from "../../components/Common/Loader";
import { formatDate } from "../../utils/formatDate";
import { Link } from "react-router-dom";

const TransactionsTable = ({ loading, error, transactions, sellerType }) => {
  // if (loading) {
  //   return (
  //     <div className="w-full mt-10 flex justify-center items-center min-h-[80vh] bg-white">
  //       <Loader />
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div className="w-full mt-10 flex justify-center min-h-[80vh] bg-white text-red-500 font-medium">
        {error}
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="relative overflow-x-auto mt-6 bg-white min-h-screen custom-shadow rounded-[12px] p-3 text-center text-gray-500 font-medium flex items-center justify-center">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="relative overflow-x-auto mt-6 bg-white min-h-screen custom-shadow rounded-[12px] p-3">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 border-separate border-spacing-0 rounded-[8px] overflow-hidden bg-[#2b3743]/10">
        <thead className="text-xs text-gray-700 light-green-bg">
          <tr>
            <th className="px-6 py-4 text-sm font-medium">Order Number</th>
            <th className="px-6 py-4 text-sm font-medium">Product Name</th>
            <th className="px-6 py-4 text-sm font-medium">
              {sellerType === "seller" ? "Buyer" : "Seller"}
            </th>
            <th className="px-6 py-4 text-sm font-medium">Amount</th>
            <th className="px-6 py-4 text-sm font-medium">Date</th>
          </tr>
        </thead>

        <tbody>
          {transactions?.map((transaction, i) => (
            <tr key={i} className="bg-white border-b border-gray-400">
              <td className="px-6 py-4 border-b text-sm">
                {transaction?.orderNumber}
              </td>

              <td className="px-6 py-4 border-b text-sm">
                <div className="flex items-center gap-2">
                  <img
                    src={transaction?.product?.image || "/profile-icon.png"}
                    alt="product"
                    className="w-[43px] h-[43px] object-cover rounded-full"
                  />
                  <Link
                    to={`/products/${transaction?.product?.title}?productId=${transaction?.product?.id}`}
                    className="text-sm font-normal"
                  >
                    {transaction?.product?.title}
                  </Link>
                </div>
              </td>

              <td className="px-6 py-4 border-b text-sm">
                {sellerType === "buyer" ? (
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        transaction?.seller?.profilePictureUrl ||
                        "/profile-icon.png"
                      }
                      alt="seller"
                      className="w-[43px] h-[43px] object-cover rounded-full"
                    />
                    <Link
                      to={`/transaction-history/member/details/${transaction?.seller?.id}?isOrderPlaced=true&isBuyer=false`}
                      className="text-sm font-normal"
                    >
                      {transaction?.seller?.name}
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <img
                      src={
                        transaction?.buyer?.profilePictureUrl ||
                        "/profile-icon.png"
                      }
                      alt="buyer"
                      className="w-[43px] h-[43px] object-cover rounded-full"
                    />
                    <Link
                      to={`/transaction-history/member/details/${transaction?.buyer?.id}?isOrderPlaced=true&isBuyer=true`}
                      className="text-sm font-normal"
                    >
                      {transaction?.buyer?.name}
                    </Link>
                  </div>
                )}
              </td>

              <td className="px-6 py-4 border-b text-sm">
                $
                {sellerType === "buyer"
                  ? transaction?.price?.toFixed(2)
                  : transaction?.transaction?.seller?.amount}
              </td>

              <td className="px-6 py-4 border-b text-sm">
                {formatDate(transaction?.order?.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(TransactionsTable);
