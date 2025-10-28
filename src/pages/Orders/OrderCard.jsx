import { Link } from "react-router-dom";

const OrderCard = ({ product }) => {
  return (
    <div className="w-full bg-[var(--secondary-bg)] p-5 rounded-[8px] relative overflow-hidden">
      <div className="w-full flex items-center justify-between">
        <Link
          to={`/orders/details/${product?.orderNumber}`}
          className="text-xs font-medium"
        >
          Booking ID #${product?.orderNumber}
        </Link>
        <p className="text-xs font-medium text-[#FF7700]">In Progress</p>
      </div>
      <div className="w-full border border-gray-300 my-4" />
      <div className="w-full space-y-3">
        {product?.items?.map((item, i) => {
          return (
            <div
              key={i}
              className="w-full grid grid-cols-5 border-b-2 border-gray-300 pb-4"
            >
              <div className="col-span-3">
                <div className="flex items-center gap-3">
                  <img
                    src={item?.imageUrl}
                    alt=""
                    className="min-w-[64px] min-h-[64px] max-w-[64px] max-h-[64px] rounded-[10px] object-cover"
                  />
                  <p className="text-sm font-bold leading-none">
                    {item?.title?.length > 30
                      ? `${item?.title?.slice(0, 25)}...`
                      : item?.title}
                  </p>
                </div>
              </div>
              <div className="w-full col-span-2 grid grid-cols-2 gap-10">
                <div className="flex flex-col items-end justify-center gap-1.5">
                  <p className="text-sm text-[#6D6D6D] font-medium">
                    Delivery Type
                  </p>
                  <p className="font-medium leading-none">
                    {item?.selectedDeliveryMethod === "pickup"
                      ? "Pickup"
                      : item?.selectedDeliveryMethod === "delivery"
                      ? "Delivery"
                      : "Pickup / Delivery"}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-x-20">
                  <div className="flex flex-col items-end justify-center gap-2">
                    <p className="text-sm text-[#6D6D6D] font-medium leading-none">
                      Price
                    </p>
                    <p className="text-sm text-[#000] font-medium leading-none">
                      $ {item?.price}
                    </p>
                  </div>
                  {/* <Link to={`/products/${item?.id}`} className="max-w-[38px]">
                    <div className="w-[38px] max-w-[38px] h-[38px] rounded-[11px] flex items-center justify-center bg-[var(--button-bg)]">
                      <img
                        src="/right-arrow-icon.png"
                        alt=""
                        className="w-[7px] h-[14px]"
                      />
                    </div>
                  </Link> */}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderCard;
