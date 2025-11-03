import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate, useParams } from "react-router-dom";
import OrderSummary from "./OrderSummary";
import { FaLocationDot } from "react-icons/fa6";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { formatDate } from "../../utils/formatDate";
import PickupItemsList from "./PickupItemsList";
import DeliveryItemsList from "./DeliveryItemsList";
import Loader from "../../components/Common/Loader";

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [details, setDetails] = useState(null);
  const [pickupItems, setPickupItems] = useState(null);
  const [deliveryItems, setDeliveryItems] = useState(null);

  const [loading, setLoading] = useState(false);

  const getOrderStatus = (items = []) => {
    if (!items || items.length === 0) {
      return { label: "Pending", color: "#888888" };
    }

    // If any item is still in progress
    if (items.some((item) => item?.buyerStatus === "in_progress")) {
      return { label: "In Progress", color: "#FF7700" };
    }

    // If all items are completed
    const allCompleted = items.every(
      (item) =>
        (item?.deliveryMethod === "pickup" &&
          item?.buyerStatus === "picked_up") ||
        (item?.deliveryMethod === "delivery" &&
          item?.buyerStatus === "delivered")
    );

    if (allCompleted) {
      return { label: "Completed", color: "#28A745" };
    }

    // If some are delivered/picked but not all
    const partiallyCompleted = items.some(
      (item) =>
        item?.buyerStatus === "delivered" || item?.buyerStatus === "picked_up"
    );

    if (partiallyCompleted) {
      return { label: "Partially Completed", color: "#007BFF" };
    }

    // Default
    return { label: "Pending", color: "#888888" };
  };

  const orderStatus = getOrderStatus(details?.items);

  const computeOverallStatus = (items) => {
    if (!items || items.length === 0) return "Pending";

    const buyerStatuses = items.map((i) => i?.buyerStatus);
    const sellerStatuses = items.map((i) => i?.sellerStatus);

    // Priority order (you can adjust this based on your business rules)
    if (
      buyerStatuses.includes("cancelled") ||
      sellerStatuses.includes("cancelled")
    )
      return "Cancelled";
    if (sellerStatuses.includes("out_for_delivery")) return "Out for Delivery";
    if (sellerStatuses.includes("ready_for_pickup")) return "Ready for Pickup";
    if (
      buyerStatuses.includes("in_progress") ||
      sellerStatuses.includes("in_progress")
    )
      return "In Progress";
    if (buyerStatuses.every((s) => s === "delivered" || s === "picked_up"))
      return "Completed";

    return "Pending";
  };

  const overallStatus = computeOverallStatus(details?.items);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const order = response?.data?.data?.order;

      setDetails(order);

      if (order?.items) {
        // getOrderStatus(order?.items);
        setPickupItems(
          order.items.filter((item) => item.deliveryMethod === "pickup")
        );
        setDeliveryItems(
          order.items.filter((item) => item.deliveryMethod === "delivery")
        );
      }
    } catch (error) {
      console.error("order details error >>> ", error);
      handleApiError(error, navigate);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);

  if (loading) {
    return (
      <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-28">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full max-w-[48px] flex items-center justify-between text-sm text-white"
        >
          <HiArrowLeft />
          Back
        </button>
        <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-5">
          <div className="w-full bg-white rounded-[18px] relative p-5 min-h-[70vh] flex items-center justify-center">
            <Loader />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-28">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="w-full max-w-[48px] flex items-center justify-between text-sm text-white"
      >
        <HiArrowLeft />
        Back
      </button>

      <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-5 grid grid-cols-3 gap-5">
        <div className="w-full bg-white rounded-[18px] relative p-5 min-h-[70vh] col-span-2">
          <div className="w-full flex items-star flex-col justify-start relative">
            <div className="w-full">
              <p className="font-semibold text-[20px] leading-none tracking-tight break-words">
                Order Details
              </p>
            </div>
            <div className="w-full border my-4" />
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-gray-600">Order ID</p>
              <p className="text-base text-gray-600">#{details?.orderNumber}</p>
            </div>
            <div className="w-full border my-4" />
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-gray-600">Order Placed</p>
              <p className="text-base text-gray-600">
                {formatDate(details?.createdAt)}
              </p>
            </div>
            <div className="w-full border my-4" />
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-gray-600">Order Status</p>
              {/* <p
                className="text-base font-medium"
                style={{ color: orderStatus.color }}
              >
                {orderStatus.label}
              </p> */}

              <p
                className={`text-base font-medium ${
                  overallStatus === "Completed"
                    ? "text-green-500"
                    : overallStatus === "Cancelled"
                    ? "text-red-500"
                    : overallStatus === "In Progress"
                    ? "text-yellow-500"
                    : "text-gray-500"
                }`}
              >
                {overallStatus}
              </p>
            </div>

            {deliveryItems?.length > 0 && (
              <>
                <div className="w-full border my-4" />
                <DeliveryItemsList
                  deliveryItems={deliveryItems}
                  fetchOrderDetails={fetchOrderDetails}
                  orderDetails={details}
                />
              </>
            )}

            {pickupItems && pickupItems?.length > 0 && (
              <>
                <div className="border border-gray-300 w-full my-4" />
                <PickupItemsList
                  pickupItems={pickupItems}
                  fetchOrderDetails={fetchOrderDetails}
                  orderDetails={details}
                />
              </>
            )}
          </div>
        </div>

        <div className="w-full col-span-1">
          <OrderSummary orderSummary={details} />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
