import { useEffect, useState } from "react";
import TransactionHistoryTable from "./TransactionHistoryTable";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { useNavigate, useSearchParams } from "react-router-dom";
import { handleApiError } from "../../utils/handleApiError";
import { useAppContext } from "../../context/AppContext";
import { useTranslation } from "react-i18next";
import formatAmount from "../../utils/formatAmount";
import i18n from "i18next";

const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { fetchNotificaiontCount } = useAppContext();
  const { t } = useTranslation("transactionHistory");

  const LIMIT = 10;
  const page = Number(searchParams.get("page") || 1);

  const [sellerType, setSellerType] = useState("buyer");
  const [searchTerm, setSearchTerm] = useState("");
  const [userBalance, setUserBalance] = useState({
    balanceAmount: 0,
    totalSpent: 0,
  });

  const getRevenue = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/user/financial-summary`, {
        headers: {
          "Accept-Language": i18n.language,
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setUserBalance(response?.data?.data);
    } catch (error) {
      handleApiError(error, navigate);
    }
  };

  const getTransactions = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axios.get(`${BASE_URL}/user/transactions`, {
        params: {
          type: sellerType,
          page,
          limit: LIMIT,
          search: searchTerm || undefined,
        },
        headers: {
          "Accept-Language": i18n.language,
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setTransactions(res.data?.data || []);
      setPagination(res.data?.pagination);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err?.response?.data?.message || "Failed to load transactions.");
      handleApiError(err, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Transaction History - giveXchange";
    const debouncedFetch = debounce(() => {
      getRevenue();
      getTransactions();
      fetchNotificaiontCount();
    }, 500);
    debouncedFetch();
  }, [sellerType, page, searchTerm]);

  return (
    <div className="w-full relative padding-x min-h-screen">
      <div className="w-full rounded-[15px] relative -top-24 bg-[#F7F7F7] p-4 min-h-screen">
        <div className="w-full bg-white p-6 lg:p-8 rounded-[12px]">
          <h2 className="font-medium text-lg lg:text-xl leading-none">
            {sellerType === "seller"
              ? t(`availableBalance`)
              : t(`totalPurchases`)}
          </h2>
          {sellerType === "seller" ? (
            <p className="text-[var(--button-bg)] text-[34px] lg:text-[45px] font-semibold">
              {userBalance &&
                `$${
                  userBalance?.balanceAmount > 0
                    ? formatAmount(userBalance?.balanceAmount.toFixed(2))
                    : `$0`
                }`}
            </p>
          ) : (
            <p className="text-[var(--button-bg)] text-[34px] lg:text-[45px] font-semibold">
              {userBalance &&
                `$${
                  userBalance?.totalSpent > 0
                    ? formatAmount(userBalance?.totalSpent.toFixed(2))
                    : `$0`
                }`}
            </p>
          )}
        </div>

        <TransactionHistoryTable
          sellerType={sellerType}
          setSellerType={setSellerType}
          transactions={transactions}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loading={loading}
          error={error}
          pagination={pagination}
          page={page}
        />
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
