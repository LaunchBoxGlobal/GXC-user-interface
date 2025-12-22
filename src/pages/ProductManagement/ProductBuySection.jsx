import { useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import Loader from "../../components/Common/Loader";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { enqueueSnackbar } from "notistack";
import { handleApiError } from "../../utils/handleApiError";
import { useCart } from "../../context/cartContext";
import { FaLocationDot } from "react-icons/fa6";
import { useUser } from "../../context/userContext";
import { Link, useSearchParams } from "react-router-dom";

const ProductBuySection = ({
  productDetails,
  deliveryType,
  setDeliveryType,
  addProductInCart,
  setAddProductInCart,
  selectedCommunity,
  fetchCartCount,
  navigate,
}) => {
  const { cartProducts, fetchCartProducts } = useCart();
  const { checkIamAlreadyMember } = useUser();
  const [searchParams] = useSearchParams();
  const isOrderPlaced = searchParams.get("isOrderPlaced") || false;

  const isProductInCart = cartProducts?.find(
    (product) => product?.product?.id === productDetails?.id
  );

  useEffect(() => {
    if (productDetails?.deliveryMethod === "pickup") {
      setDeliveryType("pickup");
    } else if (productDetails?.deliveryMethod === "delivery") {
      setDeliveryType("delivery");
    } else if (productDetails?.deliveryMethod === "both") {
      setDeliveryType("both");
    }
  }, [productDetails?.deliveryMethod, setDeliveryType]);

  const handleAddToCartProduct = async () => {
    if (!deliveryType || deliveryType === "both") {
      enqueueSnackbar("Please select a delivery type.", {
        variant: "error",
      });
      return;
    }

    // if (deliveryType === "both") {
    //   enqueueSnackbar("Please select a delivery type.", {
    //     variant: "error",
    //   });
    //   return;
    // }

    if (!selectedCommunity?.id) {
      enqueueSnackbar("Community ID not found!", { variant: "error" });
      return;
    }

    if (!productDetails?.id) {
      enqueueSnackbar("Product ID not found!", { variant: "error" });
      return;
    }

    // return;
    checkIamAlreadyMember();
    setAddProductInCart(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/communities/${selectedCommunity?.id}/cart/${productDetails?.id}`,
        {
          deliveryMethod:
            deliveryType === "delivery" ? deliveryType : deliveryType,
        },
        { headers: { Authorization: `Bearer ${getToken()}` } }
      );

      if (res?.data?.success) {
        enqueueSnackbar(
          res?.data?.message || "Product added to cart successfully!",
          { variant: "success" }
        );
        fetchCartCount();
        fetchCartProducts();
      }
    } catch (error) {
      // console.log(error);
      if (
        error?.status == 400 &&
        error?.response?.data?.message == "Product is not available"
      ) {
        enqueueSnackbar("Unfortunately, this product is no longer available.", {
          variant: "error",
          autoHideDuration: 3000,
        });
        navigate("/");
        return;
      }
      handleApiError(error, navigate);
    } finally {
      setAddProductInCart(false);
    }
  };

  const showDeliveryButton =
    productDetails?.deliveryMethod === "delivery" ||
    productDetails?.deliveryMethod === "both";

  const showPickupButton =
    productDetails?.deliveryMethod === "pickup" ||
    productDetails?.deliveryMethod === "both";

  return (
    <div className="w-full">
      <div className="w-full border my-5" />
      <div className="w-full space-y-3">
        <p className="text-sm font-semibold">Delivery Type</p>

        <div
          className={`w-full max-w-[320px] grid ${
            showDeliveryButton && showPickupButton
              ? "grid-cols-2"
              : "grid-cols-1"
          } gap-2 lg:gap-1`}
        >
          {/* ✅ Delivery Option (only shown if applicable) */}
          {showDeliveryButton && (
            <button
              type="button"
              onClick={() => setDeliveryType("delivery")}
              disabled={isProductInCart || productDetails?.status !== "active"}
              className={`rounded-[12px] text-xs md:text-sm font-medium h-[41px] flex items-center justify-center relative transition-all ${
                deliveryType === "delivery"
                  ? "bg-[var(--button-bg)] text-white"
                  : "bg-[var(--secondary-bg)] text-black"
              } disabled:opacity-60 disabled:cursor-not-allowed max-w-[150px]`}
            >
              {deliveryType === "delivery" && (
                <div className="w-4 h-4 border p-1 rounded-full bg-[var(--button-bg)] flex items-center justify-center absolute -top-1 -right-1">
                  <FaCheck className="text-white text-xs" />
                </div>
              )}
              Community Pickup
            </button>
          )}

          {/* ✅ Pickup Option (only shown if applicable) */}
          {showPickupButton && (
            <button
              type="button"
              onClick={() => setDeliveryType("pickup")}
              disabled={isProductInCart || productDetails?.status !== "active"}
              className={`rounded-[12px] text-xs md:text-sm font-medium h-[41px] flex items-center justify-center relative transition-all ${
                deliveryType === "pickup"
                  ? "bg-[var(--button-bg)] text-white"
                  : "bg-[var(--secondary-bg)] text-black"
              } disabled:opacity-60 disabled:cursor-not-allowed max-w-[130px]`}
            >
              {deliveryType === "pickup" && (
                <div className="w-4 h-4 border p-1 rounded-full bg-[var(--button-bg)] flex items-center justify-center absolute -top-1 -right-1">
                  <FaCheck className="text-white text-xs" />
                </div>
              )}
              Self-Pickup
            </button>
          )}
        </div>
      </div>

      {/* ✅ Pickup Address (conditional display) */}
      {(productDetails?.deliveryMethod === "pickup" ||
        (productDetails?.deliveryMethod === "both" &&
          deliveryType === "pickup")) &&
        productDetails?.pickupAddress?.address && (
          <>
            <div className="w-full border my-5" />
            <p className="text-sm font-semibold">Pickup Address</p>
            <div className="w-full mt-2 flex items-center gap-2">
              <FaLocationDot className="text-base" />
              <div className="text-sm font-normal flex flex-wrap gap-1 break-words">
                {productDetails?.pickupAddress?.address}
              </div>
            </div>
          </>
        )}

      {/* ✅ Pickup Address (conditional display) */}
      {deliveryType === "delivery" &&
        productDetails?.communityPickupAddress?.address && (
          <>
            <div className="w-full border my-5" />
            <p className="text-sm font-semibold">Community Pickup Address</p>
            <div className="w-full mt-2 flex items-center gap-2">
              <FaLocationDot className="text-base" />
              <div className="text-sm font-normal flex flex-wrap gap-1 break-words">
                {productDetails?.communityPickupAddress?.address}
              </div>
            </div>
          </>
        )}

      {productDetails?.seller && (
        <>
          <div className="w-full border my-5" />

          <p className="text-sm font-semibold mb-1">Seller:</p>

          <Link
            to={`/order-management/details/seller/${productDetails?.community?.id}/${productDetails?.seller?.id}?isOrderPlaced=${isOrderPlaced}`}
            className="w-full flex items-center gap-2"
          >
            <div className="">
              <img
                src={
                  productDetails?.seller?.profilePictureUrl
                    ? productDetails?.seller?.profilePictureUrl
                    : `/profile-icon.png`
                }
                alt="seller profile picture"
                className="w-[48px] h-[48px] rounded-full object-cover"
              />
            </div>
            <div className="">
              <p className="font-medium tracking-tight leading-none">
                {productDetails?.seller?.name}
              </p>
              <p className="text-sm text-gray-500">
                {productDetails?.seller?.email}
              </p>
            </div>
          </Link>
        </>
      )}

      {/* ✅ Action Button */}
      {productDetails?.status === "active" && (
        <>
          {isProductInCart ? (
            <button
              type="button"
              className="button mt-5"
              onClick={() => navigate(`/cart/${selectedCommunity?.id}`)}
            >
              Go to cart
            </button>
          ) : (
            <button
              type="button"
              disabled={addProductInCart}
              className="button mt-5"
              onClick={handleAddToCartProduct}
            >
              {addProductInCart ? <Loader /> : "Add to cart"}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ProductBuySection;
