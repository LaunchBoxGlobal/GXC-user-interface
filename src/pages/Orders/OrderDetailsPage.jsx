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

  // const computeOverallStatus = (items) => {
  //   if (!items || items.length === 0) return "Pending";

  //   const buyerStatuses = items.map((i) => i?.buyerStatus);
  //   const sellerStatuses = items.map((i) => i?.sellerStatus);

  //   // Priority order (you can adjust this based on your business rules)
  //   if (
  //     buyerStatuses.includes("cancelled") ||
  //     sellerStatuses.includes("cancelled")
  //   )
  //     return "Cancelled";
  //   if (sellerStatuses.includes("out_for_delivery")) return "Out for Delivery";
  //   if (sellerStatuses.includes("ready_for_pickup")) return "Ready for Pickup";
  //   if (
  //     buyerStatuses.includes("in_progress") ||
  //     sellerStatuses.includes("in_progress")
  //   )
  //     return "In Progress";
  //   if (buyerStatuses.every((s) => s === "delivered" || s === "picked_up"))
  //     return "Completed";

  //   return "Pending";
  // };

  const computeOverallStatus = (items) => {
    if (!items || items.length === 0) return "Pending";

    const buyerStatuses = items.map((i) => i?.buyerStatus);
    const sellerStatuses = items.map((i) => i?.sellerStatus);

    const allCancelled =
      buyerStatuses.every((s) => s === "cancelled") ||
      sellerStatuses.every((s) => s === "cancelled");

    const anyCancelled =
      buyerStatuses.includes("cancelled") ||
      sellerStatuses.includes("cancelled");

    const allCompleted = buyerStatuses.every(
      (s) => s === "delivered" || s === "picked_up"
    );

    const anyDelivered = buyerStatuses.some(
      (s) => s === "delivered" || s === "picked_up"
    );

    // 🟥 1. All items cancelled
    if (allCancelled) return "Cancelled";

    // 🟢 2. Some cancelled but others delivered → still Completed
    if (anyCancelled && anyDelivered) return "Completed";

    // 🟠 3. Some cancelled but others still active → In Progress
    if (
      anyCancelled &&
      (buyerStatuses.includes("in_progress") ||
        buyerStatuses.includes("pending") ||
        sellerStatuses.includes("in_progress") ||
        sellerStatuses.includes("pending"))
    )
      return "In Progress";

    // 🟠 4. Any still in progress
    if (
      buyerStatuses.includes("in_progress") ||
      sellerStatuses.includes("in_progress")
    )
      return "In Progress";

    // 🟢 5. Ready for pickup / out for delivery
    if (sellerStatuses.includes("ready_for_pickup")) return "Ready for Pickup";
    if (sellerStatuses.includes("out_for_delivery")) return "Out for Delivery";

    // ✅ 6. All delivered or picked up
    if (allCompleted) return "Completed";

    // ⚪ 7. Default fallback
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
    document.title = "Order Management - GiveXChange";
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
        onClick={() => navigate("/")}
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

              <p
                className={`text-base font-medium ${
                  overallStatus === "Completed"
                    ? "text-green-500"
                    : overallStatus === "Cancelled"
                    ? "text-red-500"
                    : overallStatus === "In Progress"
                    ? "text-[#FF7700]"
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
