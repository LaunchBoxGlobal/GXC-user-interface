import { useEffect } from "react";
import { FaCheck } from "react-icons/fa6";
import Loader from "../../components/Common/Loader";
import axios from "axios";
import { BASE_URL } from "../../data/baseUrl";
import { getToken } from "../../utils/getToken";
import { enqueueSnackbar } from "notistack";
import { handleApiError } from "../../utils/handleApiError";
import { useCart } from "../../context/cartContext";

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

  const isProductInCart = cartProducts?.find(
    (product) => product?.product?.id === productDetails?.id
  );

  // ✅ Auto-select delivery type if only one delivery method is available
  useEffect(() => {
    if (productDetails?.deliveryMethod === "pickup") {
      setDeliveryType("pickup");
    } else if (productDetails?.deliveryMethod === "delivery") {
      setDeliveryType("delivery");
    }
  }, [productDetails?.deliveryMethod, setDeliveryType]);

  const handleAddToCartProduct = async () => {
    if (!deliveryType) {
      enqueueSnackbar("Please select a delivery method first!", {
        variant: "error",
      });
      return;
    }

    if (!selectedCommunity?.id) {
      enqueueSnackbar("Community ID not found!", { variant: "error" });
      return;
    }

    if (!productDetails?.id) {
      enqueueSnackbar("Product ID not found!", { variant: "error" });
      return;
    }

    setAddProductInCart(true);
    try {
      const res = await axios.post(
        `${BASE_URL}/communities/${selectedCommunity?.id}/cart/${productDetails?.id}`,
        { deliveryMethod: deliveryType },
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
      handleApiError(error, navigate);
    } finally {
      setAddProductInCart(false);
    }
  };

  // ✅ Determine which delivery buttons to show
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
          className={`w-full max-w-[350px] grid ${
            showDeliveryButton && showPickupButton
              ? "grid-cols-2 gap-2"
              : "grid-cols-1"
          }`}
        >
          {/* ✅ Delivery Option (only shown if applicable) */}
          {showDeliveryButton && (
            <button
              type="button"
              onClick={() => setDeliveryType("delivery")}
              disabled={isProductInCart}
              className={`rounded-[12px] text-sm font-medium h-[41px] flex items-center justify-center relative transition-all ${
                deliveryType === "delivery"
                  ? "bg-[var(--button-bg)] text-white"
                  : "bg-[var(--secondary-bg)] text-black"
              } disabled:opacity-60 disabled:cursor-not-allowed max-w-[140px]`}
            >
              {deliveryType === "delivery" && (
                <div className="w-4 h-4 border p-1 rounded-full bg-[var(--button-bg)] flex items-center justify-center absolute -top-1 -right-1">
                  <FaCheck className="text-white text-xs" />
                </div>
              )}
              Deliver at home
            </button>
          )}

          {/* ✅ Pickup Option (only shown if applicable) */}
          {showPickupButton && (
            <button
              type="button"
              onClick={() => setDeliveryType("pickup")}
              disabled={isProductInCart}
              className={`rounded-[12px] text-sm font-medium h-[41px] flex items-center justify-center relative transition-all ${
                deliveryType === "pickup"
                  ? "bg-[var(--button-bg)] text-white"
                  : "bg-[var(--secondary-bg)] text-black"
              } disabled:opacity-60 disabled:cursor-not-allowed max-w-[120px]`}
            >
              {deliveryType === "pickup" && (
                <div className="w-4 h-4 border p-1 rounded-full bg-[var(--button-bg)] flex items-center justify-center absolute -top-1 -right-1">
                  <FaCheck className="text-white text-xs" />
                </div>
              )}
              Self Pickup
            </button>
          )}
        </div>
      </div>

      {productDetails?.pickupAddress?.address && (
        <>
          <div className="w-full border my-5" />
          <p className="text-sm font-semibold">Pickup Address</p>
          <div className="w-full mt-2 flex items-center justify-start gap-1 flex-wrap">
            {Object.entries(productDetails.pickupAddress)
              .filter(([_, value]) => value)
              .map(([key, value]) => (
                <p key={key} className="text-sm font-normal">
                  {value}
                </p>
              ))}
          </div>
        </>
      )}

      {/* ✅ Action Button */}
      {isProductInCart ? (
        <button
          type="button"
          className="button mt-5"
          onClick={() => navigate(`/cart/${selectedCommunity?.id}`)}
        >
          Go to Cart
        </button>
      ) : (
        <button
          type="button"
          disabled={addProductInCart}
          className="button mt-5"
          onClick={handleAddToCartProduct}
        >
          {addProductInCart ? <Loader /> : "Add To Cart"}
        </button>
      )}
    </div>
  );
};

export default ProductBuySection;
