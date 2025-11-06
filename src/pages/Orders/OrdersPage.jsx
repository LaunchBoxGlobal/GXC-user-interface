import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import Loader from "../../components/Common/Loader";
import OrderTypeTabs from "./OrderTypeTabs";
import OrderCard from "./OrderCard";
import SellerOrderCard from "./SellerOrderCard";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || null;
  const activeOrderType = searchParams.get("orderType") || "";
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(null);

  const page = Number(searchParams.get("page")) || 1;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const statusKey =
        activeTab === "seller" ? "overallStatus" : "buyerStatus";

      const url = `${BASE_URL}/my-orders?limit=10&page=${page}${
        activeOrderType !== "all" ? `&${statusKey}=${activeOrderType}` : ""
      }${activeTab ? `&role=${activeTab}` : ""}`;
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      setData(response?.data?.data?.orders);
      setPagination(response?.data?.data?.pagination);
    } catch (error) {
      console.error(error);
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Order Management - GiveXChange";
    fetchOrders();
  }, [activeTab, activeOrderType, page]);

  if (loading)
    return (
      <div className="w-full flex justify-center items-center min-h-[80vh]">
        <Loader />
      </div>
    );

  // Handle pagination click
  const handlePageChange = (newPage) => {
    if (!pagination || newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    navigate(`?${params.toString()}`);
  };

  const renderPageNumbers = () => {
    if (!pagination) return null;
    const { totalPages } = pagination;
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i}>
          <button
            onClick={() => handlePageChange(i)}
            aria-current={i === page ? "page" : undefined}
            className={`flex items-center justify-center px-4 h-10 leading-tight font-medium rounded-[12px] ${
              i === page
                ? "text-white bg-[var(--button-bg)] font-medium"
                : "text-gray-600 hover:bg-[var(--button-bg)] hover:text-white"
            }`}
          >
            {i}
          </button>
        </li>
      );
    }
    return pages;
  };
  return (
    <div className="w-full min-h-screen padding-x py-20 padding-x">
      <div className="w-full bg-[var(--secondary-bg)] p-5 rounded-[20px] lg:rounded-[30px]">
        <div className="bg-white w-full rounded-[18px] p-5 lg:p-7">
          <OrderTypeTabs />
          {data && data?.length > 0 ? (
            <>
              <div className="w-full space-y-4 mt-7">
                {activeTab === "buyer" ? (
                  <>
                    {data?.map((pr, index) => {
                      return <OrderCard key={index} product={pr} />;
                    })}
                  </>
                ) : (
                  <>
                    {data?.map((pr, index) => {
                      return <SellerOrderCard key={index} product={pr} />;
                    })}
                  </>
                )}
              </div>
              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <nav
                  aria-label="Page navigation"
                  className="flex justify-end w-full mt-10"
                >
                  <ul className="inline-flex items-center gap-2 px-2 -space-x-px text-base h-[58px] bg-[#E6E6E6BD] rounded-[12px]">
                    {/* Previous Button */}
                    <li>
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page <= 1}
                        className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight font-medium rounded-[12px] ${
                          page <= 1
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-600 hover:bg-[var(--button-bg)] hover:text-white"
                        }`}
                      >
                        Previous
                      </button>
                    </li>

                    {/* Page Numbers */}
                    {renderPageNumbers()}

                    {/* Next Button */}
                    <li>
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page >= pagination.totalPages}
                        className={`flex items-center justify-center px-4 h-10 leading-tight font-medium rounded-[12px] ${
                          page >= pagination.totalPages
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-600 hover:bg-[var(--button-bg)] hover:text-white"
                        }`}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          ) : (
            <div className="min-h-[80vh] w-full flex items-center justify-center gap-2">
              <p className="">No orders found!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
