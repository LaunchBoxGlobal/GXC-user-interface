import { Link, useSearchParams } from "react-router-dom";
import { toTitleCase } from "../../utils/toTitleCase";

const OrderCard = ({ product }) => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const getDisplayStatus = (buyerStatus, sellerStatus) => {
    if (buyerStatus === "cancelled") return "Cancelled by Buyer";
    if (sellerStatus === "cancelled") return "Cancelled by You";
    if (sellerStatus === "out_for_delivery") return "Out for Delivery";
    if (sellerStatus === "ready_for_pickup") return "Ready for Pickup";
    if (sellerStatus === "in_progress" || buyerStatus === "in_progress")
      return "In Progress";
    if (buyerStatus === "delivered" || buyerStatus === "picked_up")
      return "Completed";
    return "Pending";
  };

  const computeOverallStatus = (items) => {
    if (!items || items.length === 0) return "Pending";

    const buyerStatuses = items.map((i) => i?.buyerStatus);
    const sellerStatuses = items.map((i) => i?.sellerStatus);

    if (buyerStatuses.includes("cancelled")) return "Cancelled by Buyer";
    if (sellerStatuses.includes("cancelled")) return "Cancelled by Seller";
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

  const overallStatus = computeOverallStatus(product?.items);

  return (
    <div className="w-full bg-[var(--secondary-bg)] p-5 rounded-[8px] relative overflow-hidden mb-5">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <Link
          to={
            tab === "seller"
              ? `/orders/seller/details/${product?.orderNumber}`
              : `/orders/details/${product?.orderNumber}`
          }
          className="text-xs font-medium"
        >
          Order ID #{product?.orderNumber}
        </Link>

        <div>
          {/* <Link
            to={
              tab === "seller"
                ? `/orders/seller/details/${product?.orderNumber}`
                : `/orders/details/${product?.orderNumber}`
            }
            className="max-w-[28px]"
          >
            <div className="w-[28px] max-w-[28px] h-[28px] rounded-[11px] flex items-center justify-center bg-[var(--button-bg)]">
              <img
                src="/right-arrow-icon.png"
                alt=""
                className="w-[5px] h-[10px]"
              />
            </div>
          </Link> */}
          <p
            className={`text-sm font-medium ${
              overallStatus === "Completed"
                ? "text-green-500"
                : overallStatus === "Cancelled by Buyer" ||
                  overallStatus === "Cancelled by Seller"
                ? "text-red-500"
                : overallStatus === "In Progress"
                ? "text-yellow-500"
                : overallStatus === "delivered"
                ? "text-green-500"
                : "text-gray-500"
            }`}
          >
            {overallStatus}
          </p>
        </div>
      </div>

      <div className="w-full border border-gray-300 my-4" />

      {/* All Items in the Order */}
      <div className="flex flex-col gap-4">
        {product?.items?.map((item, index) => {
          return (
            <div
              key={index}
              className={`w-full flex items-center justify-between ${
                index > 0 ? "border-t-2 border-gray-300 pt-4" : ""
              }`}
            >
              {/* Left: Item Info */}
              <div className="flex items-center gap-3 lg:min-w-[55%]">
                <img
                  src={item?.imageUrl}
                  alt={item?.title}
                  className="min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] rounded-[10px] object-cover"
                />
                <div className="">
                  <p className="text-sm font-bold leading-none">
                    {item?.productTitle?.length > 30
                      ? `${item?.productTitle?.slice(0, 25)}...`
                      : item?.productTitle}
                  </p>

                  {/* <p
                    className={`text-sm font-medium mt-1 ${
                      overallStatus === "Completed"
                        ? "text-green-500"
                        : overallStatus === "Cancelled by Buyer" ||
                          overallStatus === "Cancelled by Seller"
                        ? "text-red-500"
                        : overallStatus === "In Progress"
                        ? "text-yellow-500"
                        : overallStatus === "delivered"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {overallStatus}
                  </p> */}
                </div>
              </div>

              {/* Delivery Type */}
              <div className="flex flex-col items-end justify-center gap-1.5">
                <p className="text-sm text-[#6D6D6D] font-medium">
                  Delivery Type
                </p>
                <p className="font-medium leading-none">
                  {item?.deliveryMethod === "pickup"
                    ? "Pickup"
                    : item?.deliveryMethod === "delivery"
                    ? "Delivery"
                    : "Pickup / Delivery"}
                </p>
              </div>

              {/* Price */}
              <div className="flex flex-col items-end justify-center gap-2">
                <p className="text-sm text-[#6D6D6D] font-medium leading-none">
                  Price
                </p>
                <p className="text-base text-[#000] font-medium leading-none">
                  ${item?.price}
                </p>
              </div>

              {/* Arrow (for seller tab only) */}
              {tab === "seller" && (
                <div className="flex flex-col items-end justify-center gap-2">
                  <Link
                    to={`/orders/seller/details/${product?.orderNumber}?itemId=${item?.id}`}
                  >
                    <div className="w-[49px] h-[49px] rounded-[12px] bg-[var(--button-bg)] flex items-center justify-center">
                      <img
                        src="/white-arrow.png"
                        alt="white-arrow"
                        width={7}
                        height={14}
                      />
                    </div>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderCard;
