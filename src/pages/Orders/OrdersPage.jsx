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

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const statusKey = activeTab === "seller" ? "overallStatus" : "buyerStatus";

      const url = `${BASE_URL}/my-orders?limit=10${
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
    fetchOrders();
  }, [activeTab, activeOrderType]);

  if (loading)
    return (
      <div className="w-full flex justify-center items-center min-h-[80vh]">
        <Loader />
      </div>
    );
  return (
    <div className="w-full min-h-screen padding-x py-20 padding-x">
      <div className="w-full bg-[var(--secondary-bg)] p-5 rounded-[20px] lg:rounded-[30px]">
        <div className="bg-white w-full rounded-[18px] p-5 lg:p-7">
          <OrderTypeTabs />
          {data && data?.length > 0 ? (
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
