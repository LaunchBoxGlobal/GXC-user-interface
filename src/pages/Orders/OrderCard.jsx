import { Link, useSearchParams } from "react-router-dom";
import { toTitleCase } from "../../utils/toTitleCase";

const OrderCard = ({ product }) => {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  return (
    <div className="w-full bg-[var(--secondary-bg)] p-5 rounded-[8px] relative overflow-hidden mb-5">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <Link
          to={
            tab === "seller"
              ? `/order-management/seller/details/${product?.orderNumber}`
              : `/order-management/details/${product?.orderNumber}`
          }
          className="text-xs font-medium"
        >
          Order ID #{product?.orderNumber}
        </Link>
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

                  {item?.report?.submitted &&
                  item?.overallStatus !== "completed" ? (
                    <>
                      <p
                        className={`text-xs mt-1 font-medium ${
                          item?.report?.status === "pending"
                            ? "text-[#FF7700]"
                            : item?.report?.status === "in_progress"
                            ? "text-[#FF7700]"
                            : item?.report?.status === "resolved"
                            ? "text-green-500"
                            : item?.report?.status === "ready" ||
                              item?.report?.status === "ready_for_pickup" ||
                              item?.report?.status === "out_for_delivery"
                            ? "text-green-500"
                            : "text-gray-500"
                        }`}
                      >
                        Missing
                      </p>
                      {item?.report?.status === "pending" ? (
                        <p className="text-red-500 font-medium text-xs mt-1">
                          Dispute Raised - Under Review
                        </p>
                      ) : (
                        <p className="text-green-500 font-medium text-xs mt-1">
                          Dispute Resolved
                        </p>
                      )}
                    </>
                  ) : (
                    <p
                      className={`text-xs mt-1.5 font-medium ${
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

              {/* Delivery Type */}
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
              {tab === "buyer" && (
                <div className="flex flex-col items-end justify-center gap-2">
                  <Link
                    to={`/order-management/details/${product?.orderNumber}?itemId=${item?.id}`}
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
