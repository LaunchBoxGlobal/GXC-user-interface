import { useLocation } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { useUser } from "../../context/userContext";
import Loader from "../../components/Common/Loader";

const OrderSummary = ({
  cartProducts,
  handleNavigate,
  handlePlaceOrder,
  isLoading,
  removingItems,
}) => {
  const location = useLocation();
  const { selectedCommunity } = useUser();

  const handleClick = () => {
    if (location?.pathname === `/cart/${selectedCommunity?.id}/checkout`) {
      handlePlaceOrder();
    } else {
      handleNavigate();
    }
  };
  return (
    <div className="bg-white rounded-[18px] w-full">
      <h2 className="text-[24px] font-semibold leading-none px-5 pt-5 lg:pt-7">
        Order Summary
      </h2>
      <div className="w-full border my-5" />
      {cartProducts?.items?.length > 0 ? (
        <div className="w-full px-5 pb-5">
          <div className="w-full flex items-center justify-between">
            <p className="text-base text-gray-600">Subtotal</p>
            <p className="text-base text-gray-600">
              ${cartProducts?.summary?.subtotal?.toFixed(2)}
            </p>
          </div>
          <div className="w-full border my-3" />
          <div className="w-full flex items-center justify-between">
            <p className="text-base text-gray-600">Products</p>
            <p className="text-base text-gray-600">
              {cartProducts?.summary?.itemCount}
            </p>
          </div>
          {/* <div className="w-full border my-3" />
          <div className="w-full flex items-center justify-between">
            <p className="text-base text-gray-600">Platform Fee (2%)</p>
            <p className="text-base text-gray-600">
              ${cartProducts?.summary?.subtotal}
            </p>
          </div> */}
          <div className="w-full border my-3" />
          <div className="w-full flex items-center justify-between">
            <p className="text-base text-[var(--button-bg)] font-semibold">
              Total
            </p>
            <p className="text-base text-[var(--button-bg)] font-semibold">
              ${cartProducts?.summary?.subtotal?.toFixed(2)}
            </p>
          </div>

          <div className="w-full mt-4">
            {location?.pathname ===
            `/cart/${selectedCommunity?.id}/checkout` ? (
              <div>
                <p className="text-sm">
                  <span className="font-medium">Note:</span> No cancellations
                  after purchase. Please review your order before confirming.
                </p>
                <button
                  type="button"
                  className="button mt-2"
                  disabled={removingItems}
                  onClick={() => handleClick()}
                >
                  {removingItems ? <Loader /> : "Place Order"}
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="button"
                onClick={() => handleClick()}
              >
                {" "}
                Proceed to checkout
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="pb-5 px-5">
          <p className="">Nothing to show here...</p>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
