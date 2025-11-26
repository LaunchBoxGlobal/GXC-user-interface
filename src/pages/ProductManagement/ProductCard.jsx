import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ProductCard = ({ product }) => {
  return (
    <div className="w-full md:max-w-[290px] h-auto lg:max-h-[400px] bg-white rounded-[20px] p-3 custom-shadow overflow-hidden">
      <div className="w-full relative">
        {/* <div className="w-full h-[276px] bg-[#EAEAEA] rounded-[15px] flex items-center justify-center">
          {product?.images?.length > 0 && product?.images[0]?.imageUrl ? (
            <img
              src={product?.images[0]?.imageUrl}
              alt="image placeholder"
              className="w-full h-full max-h-[276px] object-fill rounded-[15px]"
            />
          ) : (
            <img
              src="/stats-card-icon-placeholder.png"
              alt="image placeholder"
              className="max-w-[100px]"
            />
          )}
        </div> */}
        <div className="w-full h-[266px] bg-[#fff] rounded-[15px] overflow-hidden relative">
          <LazyLoadImage
            src={product?.images[0]?.imageUrl}
            effect="blur"
            alt="product"
            className="w-full h-full object-cover rounded-[15px]"
          />
        </div>
      </div>

      <div className="w-full mt-4 px-1">
        <div className="w-full flex items-center justify-between">
          <h3 className="text-[20px] font-semibold leading-none tracking-tight text-start break-words">
            {product?.title?.length > 20
              ? `${product?.title?.slice(0, 20)}...`
              : product?.title}
          </h3>
          {/* <p
            className={`text-sm font-medium ${
              product?.status === "sold"
                ? "text-red-500"
                : product?.status === " delisted"
                ? "text-[var(--rating-yellow)]"
                : product?.status === "active"
                ? "text-[var(--text-success)]"
                : "text-gray-500"
            }`}
          >
            {product?.status.charAt(0).toUpperCase() + product?.status.slice(1)}
          </p> */}
        </div>

        <p className="text-[#9D9D9DDD] text-[15px] font-normal text-start my-2">
          {product?.deliveryMethod === "pickup"
            ? "Pickup"
            : product?.deliveryMethod === "delivery"
            ? "Delivery"
            : product?.deliveryMethod === "both"
            ? "Pickup / Delivery"
            : null}
        </p>

        <div className="flex items-center justify-between gap-2">
          <p className="text-[18px] font-semibold leading-none tracking-tight">
            ${product?.price}
          </p>
          <Link to={`/products/${product?.title}?productId=${product?.id}`}>
            <div className="w-[32px] h-[32px] rounded-[10px] flex items-center justify-center bg-[var(--button-bg)]">
              <img
                src="/right-arrow-icon.png"
                alt="right arrow icon"
                className="w-[5px] h-[11px]"
              />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
