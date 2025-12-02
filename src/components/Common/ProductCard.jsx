import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const ProductCard = ({ product }) => {
  return (
    <>
      {product?.status === "active" && (
        <div className="w-full md:max-w-[290px] h-auto lg:max-h-[410px] bg-white rounded-[20px] p-3 custom-shadow overflow-hidden">
          <div className="w-full relative">
            <div className="w-full h-[266px] bg-white rounded-[15px] overflow-hidden relative [&>*]:h-full [&>*]:w-full">
              <LazyLoadImage
                src={product?.images[0]?.imageUrl}
                effect="blur"
                alt="product"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="w-full mt-4">
            <h3 className="text-[20px] font-semibold leading-none tracking-tight text-start break-words">
              {product?.title?.length > 20
                ? `${product?.title?.slice(0, 20)}...`
                : product?.title}
            </h3>

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
      )}
    </>
  );
};

export default ProductCard;
