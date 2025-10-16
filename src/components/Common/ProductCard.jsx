import { IoIosStar } from "react-icons/io";
import { Link } from "react-router-dom";

const ProductCard = ({ product, index }) => {
  return (
    <>
      {product?.status === "active" && (
        <Link
          to={`/products/${product?.title}?productId=${product?.id}`}
          key={index}
        >
          <div className="w-full md:max-w-[290px] h-[410px] bg-white rounded-[20px] p-3 custom-shadow">
            <div className="w-full relative">
              <div className="w-full h-[276px] bg-[#EAEAEA] rounded-[15px] flex items-center justify-center">
                {product?.images[0]?.imageUrl ? (
                  <img
                    src={product?.images[0]?.imageUrl}
                    alt="image placeholder"
                    className="w-full h-full max-h-[276px] object-cover rounded-[15px]"
                  />
                ) : (
                  <img
                    src="/stats-card-icon-placeholder.png"
                    alt="image placeholder"
                    className="max-w-[100px]"
                  />
                )}
              </div>
            </div>

            <div className="w-full mt-4">
              <h3 className="text-[20px] font-semibold leading-none tracking-tight text-start">
                {product?.title}
              </h3>

              <p className="text-[#9D9D9DDD] text-[15px] font-normal text-start my-2">
                {product?.deliveryMethod === "pickup"
                  ? "Self-Pickup"
                  : product?.deliveryMethod === "delivery"
                  ? "Delivery"
                  : product?.deliveryMethod === "both"
                  ? "SelfPickup/Delivery"
                  : null}
              </p>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <IoIosStar className="text-[#FFD700] text-lg" />
                  <p className="font-medium">4.5</p>
                </div>

                <p className="text-[18px] font-medium leading-none tracking-tight">
                  ${product?.price}
                </p>
              </div>
            </div>
          </div>
        </Link>
      )}
    </>
  );
};

export default ProductCard;
