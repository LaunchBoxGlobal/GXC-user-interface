import { useEffect, useState } from "react";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { handleApiError } from "../../utils/handleApiError";
import { formatDate } from "../../utils/formatDate";
import SellerDeliveryItemsList from "./SellerDeliveryItemsList";
import SellerPickupItemsList from "./SellerPickupItemsList";
import MarkItemOutForDeliveryModal from "./MarkItemOutForDeliveryModal";
import DeliverySuccessPopup from "./DeliverySuccessPopup";
import SellerCancelDeliveryOrderConfirmationModal from "./SellerCancelDeliveryOrderConfirmationModal";
import SellerCancelDeliveryOrderReasonModal from "./SellerCancelDeliveryOrderReasonModal";
import SellerDeliveryOrderCancellationSuccessPopup from "./SellerDeliveryOrderCancellationSuccessPopup";
import SellerConfirmationMarkItemReadForPickup from "./SellerConfirmationMarkItemReadForPickup";
import { toTitleCase } from "../../utils/toTitleCase";

const SellerOrderDetailsPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get("itemId");
  const [details, setDetails] = useState(null);
  const [pickupItems, setPickupItems] = useState(null);
  const [deliveryItems, setDeliveryItems] = useState(null);
  const [showMarkItemOutForDelivery, setShowMarkItemOutForDelivery] =
    useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [
    showMarkItemReasyForPickupConfirmationModal,
    setShowMarkItemReasyForPickupConfirmationModal,
  ] = useState(false);
  const [
    showCancellationConfirmationModal,
    setShowCancellationConfirmationModal,
  ] = useState(false);
  const [showCancelSuccessModal, setShowCancelSuccessModal] = useState(false);
  const [showCancelReasonModal, setShowCancelReasonModal] = useState(false);

  const getOrderStatus = (items = []) => {
    if (!items || items.length === 0) {
      return { label: "Pending", color: "#888888" };
    }

    // If any item is still in progress
    if (items.some((item) => item?.sellerStatus === "in_progress")) {
      return { label: "In Progress", color: "#FF7700" };
    }

    // If all items are completed
    const allCompleted = items.every(
      (item) =>
        (item?.deliveryMethod === "pickup" &&
          item?.sellerStatus === "ready_for_pickup") ||
        (item?.deliveryMethod === "delivery" &&
          item?.sellerStatus === "out_for_delivery")
    );

    if (allCompleted) {
      return { label: "Completed", color: "#28A745" };
    }

    // If some are delivered/picked but not all
    const partiallyCompleted = items.some(
      (item) =>
        item?.sellerStatus === "out_for_delivery" ||
        item?.sellerStatus === "picked_up"
    );

    if (partiallyCompleted) {
      return { label: "Completed", color: "#007BFF" };
    }

    // Default
    return { label: "Pending", color: "#888888" };
  };

  const orderStatus = getOrderStatus(details?.items);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const order = response?.data?.data?.order;

      if (!order) return;

      if (itemId) {
        const singleItem = order?.items?.find(
          (item) => String(item?.id) === String(itemId)
        );
        order.items = singleItem ? [singleItem] : [];
      }

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

  const handleMarkOutForDelivery = async () => {
    setShowMarkItemOutForDelivery(true);
  };

  const handleMarkReadyToPickup = async () => {
    setShowMarkItemReasyForPickupConfirmationModal(true);
  };

  return (
    <div className="w-full bg-transparent rounded-[10px] padding-x relative -top-28 min-h-screen">
      <button
        type="button"
        onClick={() => navigate(-1)}
        // onClick={details ? navigate(-1) : navigate("/")}
        className="w-full max-w-[48px] flex items-center justify-between text-sm text-white"
      >
        <HiArrowLeft />
        Back
      </button>

      <div className="w-full bg-[var(--light-bg)] rounded-[30px] relative p-4 mt-5 grid grid-cols-3 gap-5">
        <div className="w-full bg-white rounded-[18px] relative p-5 min-h-[60vh] col-span-2">
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
            {/* <div className="w-full border my-4" />
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-gray-600">Order Status</p>
              {details?.items[0]?.sellerStatus == "cancelled" ? (
                <p className={`text-xs font-medium text-red-500`}>
                  Cancelled by Seller
                </p>
              ) : details?.buyerStatus == "cancelled" ? (
                <p className={`text-base font-medium text-red-500`}>
                  Cancelled by Buyer
                </p>
              ) : (
                <p
                  className={`text-base font-medium ${
                    details?.items[0]?.overallStatus == "cancelled"
                      ? "text-red-500"
                      : details?.items[0]?.overallStatus === "pending"
                      ? "text-[#FF7700]"
                      : details?.items[0]?.overallStatus === "in_progress"
                      ? "text-[#FF7700]"
                      : details?.items[0]?.overallStatus === "completed" ||
                        details?.items[0]?.sellerStatus === "ready"
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {toTitleCase(details?.items[0]?.overallStatus)}
                </p>
              )}
            </div> */}

            {deliveryItems?.length > 0 && (
              <>
                <div className="w-full border my-4" />
                <SellerDeliveryItemsList
                  deliveryItems={deliveryItems}
                  fetchOrderDetails={fetchOrderDetails}
                  orderDetails={details}
                />
              </>
            )}

            {pickupItems && pickupItems?.length > 0 && (
              <>
                <div className="border border-gray-300 w-full my-4" />
                <SellerPickupItemsList
                  pickupItems={pickupItems}
                  fetchOrderDetails={fetchOrderDetails}
                  orderDetails={details}
                />
              </>
            )}
          </div>
        </div>

        <div className="w-full col-span-1">
          <div className="bg-white rounded-[18px] w-full">
            <h2 className="text-[24px] font-semibold leading-none px-5 pt-5 lg:pt-7">
              Order Summary
            </h2>
            <div className="w-full border my-5" />
            <div className="w-full px-5 pb-5">
              <div className="w-full flex items-center justify-between">
                <p className="text-base text-gray-600">Subtotal</p>
                <p className="text-base text-gray-600">
                  ${details?.totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="w-full border my-3" />
              <div className="w-full flex items-center justify-between">
                <p className="text-base text-gray-600">Products</p>
                <p className="text-base text-gray-600">
                  {details?.items?.length}
                </p>
              </div>
              {/* <div className="w-full border my-3" />
              <div className="w-full flex items-center justify-between">
                <p className="text-base text-gray-600">Platform Fee (2%)</p>
                <p className="text-base text-gray-600">
                  $
                  {details?.platformFee > 0
                    ? details?.platformFeetoFixed(2)
                    : details?.platformFee}
                </p>
              </div> */}
              <div className="w-full border my-3" />
              <div className="w-full flex items-center justify-between">
                <p className="text-base text-[var(--button-bg)] font-semibold">
                  Total
                </p>
                <p className="text-base text-[var(--button-bg)] font-semibold">
                  ${details?.totalAmount.toFixed(2)}
                </p>
              </div>
              {!details?.items[0]?.cancellation_reason && (
                <div className="w-full mt-3">
                  <button
                    type="button"
                    disabled={
                      details?.items[0]?.buyerStatus == "cancelled" ||
                      details?.items[0]?.buyerStatus == "picked_up" ||
                      details?.items[0]?.sellerStatus === "out_for_delivery" ||
                      details?.items[0]?.sellerStatus === "cancelled" ||
                      details?.items[0]?.sellerStatus === "ready_for_pickup" ||
                      details?.items[0]?.buyerStatus === "delivered"
                    }
                    onClick={() =>
                      details?.items?.[0]?.deliveryMethod === "delivery"
                        ? handleMarkOutForDelivery()
                        : handleMarkReadyToPickup()
                    }
                    className={`w-full h-[48px] rounded-[12px] text-center font-medium bg-[var(--button-bg)] text-white disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed`}
                  >
                    {details?.items[0]?.buyerStatus === "cancelled"
                      ? "Cancelled by Buyer"
                      : details?.items[0]?.buyerStatus === "delivered"
                      ? "Delivered"
                      : details?.items[0]?.buyerStatus === "picked_up"
                      ? "Picked Up"
                      : details?.items[0]?.sellerStatus === "out_for_delivery"
                      ? "Ready To Pickup"
                      : details?.items[0]?.sellerStatus === "cancelled"
                      ? "Cancelled by Seller"
                      : details &&
                        details?.items?.[0]?.deliveryMethod === "delivery"
                      ? "Ready To Pickup"
                      : "Ready To Pickup"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {details?.items[0]?.cancellation_reason && (
            <div className="w-full bg-white rounded-[18px] mt-5">
              <div className="w-full p-5">
                <p className="font-semibold text-[20px] leading-none tracking-tight break-words">
                  Cancellation Reason
                </p>
              </div>
              <div className="w-full border" />
              <div className="w-full flex items-center justify-between px-5 pt-4 pb-5">
                <p className="text-base text-gray-600">
                  {" "}
                  {details?.items[0]?.cancellation_reason}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mark item ready for pickup confirmation modal */}
      <SellerConfirmationMarkItemReadForPickup
        showMarkItemReasyForPickupConfirmationModal={
          showMarkItemReasyForPickupConfirmationModal
        }
        setShowMarkItemReasyForPickupConfirmationModal={
          setShowMarkItemReasyForPickupConfirmationModal
        }
        fetchOrderDetails={fetchOrderDetails}
      />

      <MarkItemOutForDeliveryModal
        showMarkItemOutForDelivery={showMarkItemOutForDelivery}
        setShowMarkItemOutForDelivery={setShowMarkItemOutForDelivery}
        setShowSuccessModal={setShowSuccessModal}
        fetchOrderDetails={fetchOrderDetails}
      />

      <DeliverySuccessPopup
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
      />

      <SellerCancelDeliveryOrderConfirmationModal
        setShowCancellationConfirmationModal={
          setShowCancellationConfirmationModal
        }
        showCancellationConfirmationModal={showCancellationConfirmationModal}
        setShowCancelReasonModal={setShowCancelReasonModal}
      />

      <SellerCancelDeliveryOrderReasonModal
        showCancelReasonModal={showCancelReasonModal}
        setShowCancelReasonModal={setShowCancelReasonModal}
        setShowCancelSuccessModal={setShowCancelSuccessModal}
        fetchOrderDetails={fetchOrderDetails}
      />

      <SellerDeliveryOrderCancellationSuccessPopup
        showCancelSuccessModal={showCancelSuccessModal}
        setShowCancelSuccessModal={setShowCancelSuccessModal}
      />
    </div>
  );
};

export default SellerOrderDetailsPage;
