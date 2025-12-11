import { Link, useSearchParams } from "react-router-dom";
import { toTitleCase } from "../../utils/toTitleCase";

const SellerOrderCard = ({ product }) => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const getStatusColor = (status) => {
    switch (status) {
      case "cancelled":
        return "text-red-500";
      case "pending":
      case "in_progress":
        return "text-yellow-500";
      case "completed":
      case "picked_up":
        return "text-green-500";
      case "delivered":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <>
      {product?.items?.map((item, index) => {
        return (
          <div
            key={index}
            className="w-full bg-[var(--secondary-bg)] p-5 rounded-[8px] relative overflow-hidden mb-5"
          >
            {/* Header */}
            <div className="w-full flex items-center justify-between">
              <Link
                to={
                  tab === "seller"
                    ? `/order-management/seller/details/${product?.orderNumber}?itemId=${item?.id}`
                    : `/order-management/details/${product?.orderNumber}?itemId=${item?.id}`
                }
                className="text-xs font-medium"
              >
                Booking ID #${product?.orderNumber}
              </Link>
              <div>
                {item?.report?.submitted &&
                item?.overallStatus !== "completed" ? (
                  <>
                    <p className={`text-xs font-medium text-red-500`}>
                      Missing
                    </p>
                    {/* <p className={`text-xs font-medium text-red-500`}>
                      Dispute Raised - Under Review
                    </p> */}
                  </>
                ) : (
                  <p
                    className={`text-xs font-medium ${
                      item?.overallStatus == "cancelled"
                        ? "text-red-500"
                        : item?.overallStatus === "pending"
                        ? "text-[#FF7700]"
                        : item?.overallStatus === "in_progress"
                        ? "text-[#FF7700]"
                        : item?.overallStatus === "completed"
                        ? "text-green-500"
                        : item?.overallStatus === "ready" ||
                          item?.overallStatus === "ready_for_pickup" ||
                          item?.overallStatus === "out_for_delivery"
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {toTitleCase(item?.overallStatus)}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full border border-gray-300 my-4" />

            {/* Item Details */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3 lg:min-w-[55%]">
                <img
                  src={item?.imageUrl}
                  alt={item?.title}
                  className="min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] rounded-[10px] object-cover"
                />
                <p className="text-sm font-bold leading-none">
                  {item?.productTitle?.length > 30
                    ? `${item?.productTitle?.slice(0, 25)}...`
                    : item?.productTitle}
                </p>
              </div>

              <div className="flex flex-col items-end justify-center gap-1.5">
                <p className="text-sm text-[#6D6D6D] font-medium">
                  Delivery Type
                </p>
                <p className="font-medium leading-none">
                  {item?.deliveryMethod === "pickup"
                    ? "Pickup"
                    : item?.deliveryMethod === "delivery"
                    ? "Community Pickup"
                    : "Pickup / Community Pickup"}
                </p>
              </div>

              <div className="flex flex-col items-end justify-center gap-2">
                <p className="text-sm text-[#6D6D6D] font-medium leading-none">
                  Price
                </p>
                <p className="text-sm text-[#000] font-medium leading-none">
                  $ {item?.price}
                </p>
              </div>
              {tab === "seller" && (
                <div className="flex flex-col items-end justify-center gap-2">
                  <Link
                    to={
                      tab === "seller"
                        ? `/order-management/seller/details/${product?.orderNumber}?itemId=${item?.id}`
                        : `/order-management/details/${product?.orderNumber}?itemId=${item?.id}`
                    }
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
          </div>
        );
      })}
    </>
  );
};

export default SellerOrderCard;
