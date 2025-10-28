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

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [details, setDetails] = useState(null);
  const [pickupItems, setPickupItems] = useState(null);
  const [deliveryItems, setDeliveryItems] = useState(null);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const order = response?.data?.data?.order;
      // console.log("order details >>>> ", order);

      setDetails(order);

      if (order?.items) {
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
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, []);
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
              <p className="text-base text-gray-600">{details?.orderNumber}</p>
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
              <p className="text-base text-[#FF7700]">
                {details?.paymentStatus}
              </p>
            </div>

            <div className="w-full border my-4" />
            <DeliveryItemsList deliveryItems={deliveryItems} />

            {pickupItems && (
              <div className="border border-gray-300 w-full my-4" />
            )}

            <PickupItemsList pickupItems={pickupItems} />
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
